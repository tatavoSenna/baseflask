import logging

from flask import request, Blueprint, jsonify

from app import aws_auth, db
from app.users.remote import RemoteUser, get_local_user
from app.models.user import User
from app.controllers import get_user
from app.serializers.user_serializers import UserSerializer

users_bp = Blueprint('users', __name__)

@users_bp.route('me', methods=['GET'])
@aws_auth.authentication_required
@get_local_user
def me(current_user):

    return jsonify(current_user)

"""
This route may be used to force a sync between
the remote user with local user's table
"""
@users_bp.route('sync', methods=['GET'])
@aws_auth.authentication_required
def sync():
    remote_user = RemoteUser(request_headers=request.headers)
    local_user = remote_user.create_or_get_local()

    return jsonify({'user': UserSerializer().dump(local_user)})

