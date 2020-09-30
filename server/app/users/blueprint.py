import logging

import boto3
import botocore

from flask import request, Blueprint, jsonify, current_app

from app import aws_auth, db
from app.users.remote import RemoteUser, get_local_user
from app.models.user import User, UserGroup
from app.serializers.user_serializers import UserSerializer, UserGroupSerializer
from app.models.company import Company

from .helpers import get_user
from .controllers import (list_user_group_controller,
                          create_user_group_controller,
                          delete_user_group_controller,
                          get_user_group_controller)

users_bp = Blueprint("users", __name__)
user_groups_bp = Blueprint("users_groups", __name__)


@users_bp.route("me", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
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
    users = User.query.filter_by(
        company_id=logged_user.get("company_id", -1), active=True
    )
    return jsonify({"users": UserSerializer(many=True).dump(users)})


@users_bp.route("", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create(logged_user):
    fields = request.get_json()
    required_fields = set(("email", "name"))

    if not all(f in fields for f in required_fields):
        return dict(error="Missing required fields")

    email = fields.get("email")
    name = fields.get("name")

    remote_user = RemoteUser()
    response = remote_user.create(email, name)

    return jsonify({"user": UserSerializer().dump(response)})


@users_bp.route("<username>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete(logged_user, username):
    cognito = boto3.client("cognito-idp")

    user_attributes = dict(
        Username=username,
        UserPoolId=current_app.config["AWS_COGNITO_USER_POOL_ID"],
    )

    try:
        response = cognito.admin_disable_user(**user_attributes)
    except cognito.exceptions.UserNotFoundException as identifier:
        return dict(error="Username not found")

    disabled_user = User.query.filter_by(username=username).first()
    disabled_user.active = False
    db.session.add(disabled_user)
    db.session.commit()

    return response


# @users_bp.route('<username>', methods=['PATCH'])
@aws_auth.authentication_required
@get_local_user
def update(logged_user, username):
    fields = request.get_json()
    allowed_fields = set(("name"))

    if any(f not in fields for f in allowed_fields):
        return dict(error="Not allowed fields present. Please check documentation.")

    cognito = boto3.client("cognito-idp")
    email = fields.get("email")
    name = fields.get("name")

    user_attributes = dict(
        UserPoolId=current_app.config["AWS_COGNITO_USER_POOL_ID"],
        Username=username,
        UserAttributes=[
            {"Name": "email", "Value": email},
            {"Name": "name", "Value": name},
        ],
    )

    try:
        response = cognito.admin_update_user_attributes(**user_attributes)
    except err:
        return dict(error="Cognito response error")

    return response


@user_groups_bp.route("", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def list_user_groups(logged_user):
    user_groups = list_user_group_controller(logged_user)
    return jsonify({"user_groups": UserGroupSerializer(many=True).dump(user_groups)})


@user_groups_bp.route("<user_group_id>", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_user_group(logged_user, user_group_id):
    user_group, users = get_user_group_controller(logged_user, user_group_id)
    return jsonify({"user_group": UserGroupSerializer(many=False).dump(user_group),
                    "users": UserSerializer(many=True).dump(users)})


@user_groups_bp.route("", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_user_group(logged_user):
    fields = request.get_json()
    required_fields = ["name", "company_id"]

    if not all(f in fields for f in required_fields):
        return dict(error="Missing required fields")

    name = fields.get("name")
    company_id = fields.get("company_id")

    if not Company.query.get(company_id):
        return dict(error="Couldn't find any company with the given id")

    new_user_group = create_user_group_controller(name, company_id)

    return jsonify({"user_group": UserGroupSerializer().dump(new_user_group)})


@user_groups_bp.route("<group_id>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete_user_group(logged_user, group_id):

    user_group = UserGroup.query.get(group_id)
    if not user_group:
        return dict(error="User Group not found")

    delete_user_group_controller(user_group)

    return {}, 204
