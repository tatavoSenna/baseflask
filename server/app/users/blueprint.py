import logging

import boto3
import botocore

from flask import request, Blueprint, jsonify, current_app, abort

from app import aws_auth, db, IntegrityError
from app.users.remote import RemoteUser, get_local_user
from app.models.user import User, Group
from app.serializers.user_serializers import UserSerializer, GroupSerializer
from app.models.company import Company

from .controllers import (
    create_user_controller,
    list_user_controller,
    edit_user_controller,
    list_group_controller,
    create_group_controller,
    delete_group_controller,
    get_group_controller,
    add_user_to_group_controller,
    list_users_on_group_controller,
    remove_user_from_group_controller,
    get_user_controller,
    resend_user_invite_controller
)

users_bp = Blueprint("users", __name__)
groups_bp = Blueprint("groups", __name__)


@users_bp.route("me", methods=["GET"])
@aws_auth.authentication_required
@get_local_user(raise_forbidden=False)
def me(current_user):
    return jsonify(current_user)


"""
This route may be used to force a sync between
the remote user with local user's table
"""


@users_bp.route("sync", methods=["GET"])
@aws_auth.authentication_required
def sync():
    remote_user = RemoteUser(request_headers=request.headers)
    local_user = remote_user.create_or_get_local()

    return jsonify({"user": UserSerializer().dump(local_user)})


@users_bp.route("", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def list_users(logged_user):
    try:
        page = int(request.args.get(
            "page", current_app.config['PAGE_DEFAULT']))
        per_page = int(request.args.get(
            "per_page", current_app.config['PER_PAGE_DEFAULT']))
        search_param = str(request.args.get("search", ""))
    except:
        return {}, 400

    company_id = logged_user['company_id']
    paginated_query = list_user_controller(
        company_id, page, per_page, search_param)

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "users": UserSerializer(many=True).dump(paginated_query.items),
        }
    )


@users_bp.route("", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create(logged_user):
    fields = request.get_json()
    required_fields = set(("email", "name"))

    if not all(f in fields for f in required_fields):
        return dict(error="Missing required fields")

    new_user = create_user_controller(
        email=fields.get("email"),
        name=fields.get("name"),
        group_ids=fields.get("groups"),
        company_id=logged_user["company_id"]
    )
    new_user = User.query.filter_by(email=fields.get("email")).first()
    new_user.name = fields.get("name")
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"user": UserSerializer().dump(new_user)})


@users_bp.route("<username>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete(logged_user, username):
    cognito = boto3.client("cognito-idp")

    user_attributes = dict(
        Username=username,
        UserPoolId=current_app.config["AWS_COGNITO_USER_POOL_ID"],
    )

    if (logged_user['username'] == username):
        return dict(error='Cannot delete yourself'), 400

    try:
        response = cognito.admin_disable_user(**user_attributes)
    except cognito.exceptions.UserNotFoundException as identifier:
        return dict(error="Username not found")

    disabled_user = User.query.filter_by(username=username).first()
    disabled_user.active = False
    db.session.add(disabled_user)
    db.session.commit()

    return response


@users_bp.route('<username>', methods=['PATCH'])
@aws_auth.authentication_required
@get_local_user
def update(logged_user, username):
    fields = request.get_json()

    try:
        edited_user = edit_user_controller(
            username=username,
            company_id=logged_user['company_id'],
            group_ids=fields.get("groups", None)
        )
    except:
        return {}, 500

    return jsonify({"user": UserSerializer().dump(edited_user)})


@users_bp.route("re-invite", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def resend_invite(logged_user):
    content = request.json

    response = resend_user_invite_controller(content.get('username'))

    return jsonify({"response": response})


@groups_bp.route("", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def list_groups(logged_user):
    try:
        page = int(request.args.get(
            "page", current_app.config['PAGE_DEFAULT']))
        per_page = int(request.args.get(
            "per_page", current_app.config['PER_PAGE_DEFAULT']))
        search_param = str(request.args.get("search", ""))
    except:
        return {}, 400

    company_id = logged_user['company_id']
    paginated_query = list_group_controller(
        company_id, page, per_page, search_param
    )

    return jsonify({
        "page": paginated_query.page,
        "per_page": paginated_query.per_page,
        "total": paginated_query.total,
        "groups": GroupSerializer(many=True).dump(paginated_query.items)
    })


@groups_bp.route("<group_id>", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_group(logged_user, group_id):
    company_id = logged_user['company_id']
    group = get_group_controller(company_id, group_id)
    if group:
        return jsonify({"group": GroupSerializer(many=False).dump(group)})
    else:
        return {}, 404


@ groups_bp.route("", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_group(logged_user):
    fields = request.get_json()
    required_fields = ["name"]

    if not all(f in fields for f in required_fields):
        return dict(error="Missing required fields"), 400

    name = fields.get("name")
    company = Company.query.get(logged_user['company_id'])

    if not company:
        return dict(error="Couldn't find any company with the given id"), 404

    try:
        new_group = create_group_controller(company.id, name)
    except IntegrityError as e:
        if 'unique_group' in str(e):
            abort(404, "Grupo já existente")

    return jsonify({"group": GroupSerializer().dump(new_group)})


@ groups_bp.route("<group_id>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete_group(logged_user, group_id):

    group = Group.query.filter_by(
        id=group_id, active=True, company_id=logged_user['company_id']).first()
    if not group:
        return dict(error="User Group not found"), 404

    delete_group_controller(group)

    return {}, 204


@groups_bp.route("<group_id>/users", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def list_users_on_group(logged_user, group_id):
    try:
        page = int(request.args.get(
            "page", current_app.config['PAGE_DEFAULT']))
        per_page = int(request.args.get(
            "per_page", current_app.config['PER_PAGE_DEFAULT']))
        search_param = str(request.args.get("search", ""))
    except:
        return {}, 400

    company_id = logged_user['company_id']
    group = Group.query.get(group_id)
    if not group:
        return {}, 404

    if group.company_id != company_id:
        return {}, 400

    paginated_query = list_users_on_group_controller(
        group.id, page, per_page, search_param)

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "users": UserSerializer(many=True).dump(paginated_query.items),
        }
    )


@ groups_bp.route("<group_id>/users", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def add_user_to_group(logged_user, group_id):
    fields = request.get_json()
    required_fields = ["user_id"]

    if not all(f in fields for f in required_fields):
        return dict(error="Missing required fields"), 400

    company = Company.query.get(logged_user['company_id'])
    if not company:
        return dict(error="Couldn't find any company for the current user"), 404

    group = Group.query.get(group_id)
    if not group:
        return dict(error="Couldn't find group"), 404

    if group.company_id != logged_user['company_id']:
        return dict(error="Logged user has no access to specified group"), 400

    user_id = fields.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return dict(error="Couldn't find specified user"), 404

    if user.company_id != logged_user['company_id']:
        return dict(error="Specified user doesn't belong to your company"), 400

    add_user_to_group_controller(
        group_id=group_id, user_id=logged_user['id'])

    return {}, 204


@ groups_bp.route("<group_id>/users/<user_id>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def remove_user_from_group(logged_user, group_id, user_id):

    company = Company.query.get(logged_user['company_id'])
    if not company:
        return dict(error="Couldn't find any company for the current user"), 404

    group = Group.query.get(group_id)
    if not group:
        return dict(error="Couldn't find group"), 404

    if group.company_id != logged_user['company_id']:
        return dict(error="Logged user has no access to specified group"), 400

    user = User.query.get(user_id)
    if not user:
        return dict(error="Couldn't find specified user"), 404

    if user.company_id != logged_user['company_id']:
        return dict(error="Specified user doesn't belong to your company"), 400

    remove_user_from_group_controller(group_id, user_id)

    return {}, 204
