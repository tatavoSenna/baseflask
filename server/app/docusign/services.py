import requests as http
import os

from datetime import datetime
from base64 import b64encode

from app import db
from app.models.user import User

def get_token(user_data):
    try:
        token = User.query.get(user_data['id']).docusign_token
        return token
    except Exception as e:
        print(e)


def fetch_docusign_token(data):
    '''
    For the developer sandbox environment, the base URI is
    https://account-d.docusign.com/oauth
    For the production platform, the base URI is
    https://account.docusign.com/oauth
    '''
    oauth_url = os.getenv('DOCUSIGN_OAUTH_URI')
    integration_key = os.getenv('DOCUSIGN_INTEGRATION_KEY')
    secret_key = os.getenv('DOCUSIGN_SECRET_KEY')

    headers = {
        'content-type': 'app/x-www-form-urlencoded',
        'Authorization': 'Basic {}'.format(b64encode('{}:{}'.format(integration_key, secret_key).encode("utf-8")).decode("utf-8"))}

    print(data)
    response = http.post('{}/token'.format(oauth_url),
                         data=data, headers=headers)
    print(response.json())
    access_token = response.json().get('access_token')
    refresh_token = response.json().get('refresh_token')
    token_obtain_date = datetime.now()
    return (access_token, refresh_token, token_obtain_date)

def set_user_token(id, token, refresh_token, token_obtain_date):
    user = User.query.filter_by(id=id).first()
    user.docusign_token = token
    user.docusign_refresh_token = refresh_token
    user.docusign_token_obtain_date = token_obtain_date
    db.session.commit()
