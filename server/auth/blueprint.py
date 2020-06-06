from app.controllers import get_user
from app import application
from flask import request, Blueprint, jsonify

import jwt

auth_api = Blueprint('auth', __name__)

@auth_api.route('/login', methods=['POST'])
def login():
    content = request.json
    email = content['email']
    password = content['password']

    if not email or not password:
        return jsonify({'message': 'Value is missing.'}), 404

    user = get_user(email)

    if user:
        token = jwt.encode(user, application.config['SECRET_KEY'])

        return jsonify({'token': token.decode('UTF-8'), 'user': user})

    return jsonify({'message': 'Cannot be authenticated.'}), 401
