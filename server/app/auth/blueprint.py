import jwt

from flask import request, Blueprint, jsonify, redirect
from flask_awscognito import AWSCognitoAuthentication

from app import app
from app.controllers import get_user

auth_api = Blueprint('auth', __name__)
aws_auth = AWSCognitoAuthentication(app)


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
    return jsonify({'access_token': access_token})

@auth_api.route('me')
@aws_auth.authentication_required
def me():
    claims = aws_auth.claims # or g.cognito_claims
    return jsonify({'claims': claims})
