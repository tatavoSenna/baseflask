from functools import wraps
from flask import jsonify, request, current_app
import jwt

def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        token = request.headers.get('X-Auth-Token')

        if not token:
            return jsonify({'message': 'Token is missing.'}), 403

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'])
        except Exception as error:
            return jsonify({'message': 'Token is invalid.'}), 403

        return func(data, *args, **kwargs)

    return wrapped
