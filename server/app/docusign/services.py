import os

from datetime import datetime
from base64 import b64encode

import requests

from app.models.user import User
from app.models.company import Company
from app import db


def get_token(user_data):
    try:
        token = User.query.get(user_data["id"]).docusign_token
        return token
    except Exception as e:
        print(e)


def fetch_docusign_token(current_user, data):
    """
    For the developer sandbox environment, the base URI is
    https://account-d.docusign.com/oauth
    For the production platform, the base URI is
    https://account.docusign.com/oauth
    """
    company_id = current_user.get("company_id")
    company = Company.query.get(company_id)
    oauth_url = os.getenv("DOCUSIGN_OAUTH_URI")
    integration_key = company.docusign_integration_key
    secret_key = company.docusign_secret_key
    if integration_key == None:
        error = (
            {
                "error": 404,
                "error_description": "Company integration key not found"
            })
        return (None, None, None, None, error)
    if secret_key == None:
        error = (
            {
                "error": 404,
                "error_description": "Company secret key not found"
            })
        return (None, None, None, None, error)

    headers = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": "Basic {}".format(
            b64encode(
                "{}:{}".format(integration_key, secret_key).encode("ascii")
            ).decode("ascii")
        ),  
    }

    print(data)
    response = requests.post(
        "{}/token".format(oauth_url), data=data, headers=headers)
    print(response.json())
    access_token = response.json().get("access_token")
    refresh_token = response.json().get("refresh_token")
    expires_in = response.json().get("expires_in")
    token_obtain_date = datetime.now()

    error = (
        {
            "error": response.json().get("error"),
            "error_description": response.json().get("error_description"),
        }
        if response.json().get("error")
        else None
    )

    return (access_token, refresh_token, token_obtain_date, expires_in, error)


def set_user_token(id, token, refresh_token, token_obtain_date):
    user = User.query.filter_by(id=id).first()
    user.docusign_token = token
    user.docusign_refresh_token = refresh_token
    user.docusign_token_obtain_date = token_obtain_date
    db.session.commit()
