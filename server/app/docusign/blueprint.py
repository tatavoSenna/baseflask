from flask import request, Blueprint, abort, jsonify
from app.docusign.services import fetch_docusign_token
from app.docusign.services import set_user_token
from app.users.remote import get_local_user
from app import aws_auth


docusign_api = Blueprint('docusign', __name__)

'''Obtain token from docusign'''
@docusign_api.route('/token', methods=['GET'])
@aws_auth.authentication_required
@get_local_user
def docusign_token(current_user):
    authorization_code = request.args.get('code')
    data = {
        'grant_type': 'authorization_code',
        'code': '{}'.format(authorization_code)}
    (access_token, refresh_token, token_obtain_date) = fetch_docusign_token(data)
    set_user_token(current_user.get('id'), access_token,
                   refresh_token, token_obtain_date)
    return {'success': True}


'''Obtain new token from docusign
Normally works only 30 days after creation
'''
@docusign_api.route('/refresh', methods=['GET'])
@aws_auth.authentication_required
@get_local_user
def docusign_refresh_token(current_user):
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': '{}'.format('')}
    (access_token, refresh_token, token_obtain_date) = fetch_docusign_token(data)
    set_user_token(current_user.get('id'), access_token,
                   refresh_token, token_obtain_date)
    return {'success': True}
