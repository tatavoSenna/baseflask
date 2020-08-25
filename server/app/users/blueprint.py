import logging

from flask import request, Blueprint, jsonify

from app import app, aws_auth, db
from app.users.remote import RemoteUser
from app.models.user import User
from app.controllers import get_user
from app.serializers.user_serializers import UserSerializer

users_api = Blueprint('users', __name__)

@users_api.route('me', methods=['GET'])
@aws_auth.authentication_required
def me():
    remote_user = RemoteUser(request.headers)
    local_user = User.query.filter_by(sub=remote_user.sub()).first()

    response = dict(
        user=dict(
            remote=remote_user.info(),
            local=UserSerializer().dump(local_user)
        )
    )
    return jsonify(response)

"""
This route may be used to force a sync between
the remote user with local user's table
"""
@users_api.route('sync', methods=['GET'])
@aws_auth.authentication_required
def sync():
    remote_user = RemoteUser(request_headers=request.headers)
    local_user = remote_user.create_or_get_local()

    return jsonify({'user': UserSerializer().dump(local_user)})

