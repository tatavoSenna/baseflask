from flask import request, Blueprint, jsonify, redirect

from app import aws_auth
from app.serializers.user_serializers import UserSerializer
from app.users.remote import RemoteUser

auth_api = Blueprint('auth', __name__)

@auth_api.route('/sign_in')
def sign_in():
    return redirect(aws_auth.get_sign_in_url())

@auth_api.route('/sign_out')
def sign_out():
    sign_out_url = aws_auth.get_sign_in_url().replace("/login?", "/logout?")
    return redirect(sign_out_url)

@auth_api.route('/callback', methods=['GET'])
def callback():
    access_token = aws_auth.get_access_token(request.args)
    remote_user = RemoteUser(access_token=access_token)
    local_user = remote_user.create_or_get_local()

    response = dict(
        user=UserSerializer().dump(local_user),
        access_token=access_token
    )

    return jsonify(response)
