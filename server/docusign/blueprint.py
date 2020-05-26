from flask import request, Blueprint, abort, jsonify
from app.docusign.services import fetch_docusign_token
from app.auth.services import check_for_token
from app.docusign.services import set_user_token


docusign_api = Blueprint('docusign', __name__)

'''Obtain token from docusign'''
@docusign_api.route('/token', methods=['GET'])
@check_for_token
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
@check_for_token
def docusign_refresh_token(current_user):
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': '{}'.format('')}
    (access_token, refresh_token, token_obtain_date) = fetch_docusign_token(data)
    set_user_token(current_user.get('id'), access_token,
                   refresh_token, token_obtain_date)
    return {'success': True}


'''Step 3: Retrieve user account data'''
# @application.route('/docusignuserinfo/', methods=['GET'])
# # @check_for_token
# def docusign_userinfo():
#     headers = {
#         'content-type': 'application/x-www-form-urlencoded',
#         'Authorization': 'Bearer {}'.format(ACCESS_TOKEN)}
#     print(headers)
#     response = http.get(
#         '{}/userinfo'.format(DOCUSIGN_OAUTH_BASE_URI), headers=headers)
#     return response.json()