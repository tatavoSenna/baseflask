import pytest

import botocore.session

from faker import Faker

from app.models import User
from .remote import RemoteUser

fake = Faker()
email = fake.email()
sub = fake.uuid4()


class TestingRemoteUser(RemoteUser):
    client = botocore.session.get_session().create_client('cognito-idp')

    def __init__(self, request_headers=None, access_token=None):
        self.user = {
            "ResponseMetadata": {
                "HTTPHeaders": {
                "connection": "keep-alive",
                "content-length": "285",
                "content-type": "application/x-amz-json-1.1",
                "date": "Sun, 23 Aug 2020 19:01:15 GMT",
                "x-amzn-requestid": "2bdf39a5-a531-4a52-b672-5c52eac3bd9e"
                },
                "HTTPStatusCode": 200,
                "RequestId": "2bdf39a5-a531-4a52-b672-5c52eac3bd9e",
                "RetryAttempts": 0
            },
            "UserAttributes": [
                {
                "Name": "sub",
                "Value": sub
                },
                {
                "Name": "email_verified",
                "Value": "true"
                },
                {
                "Name": "phone_number_verified",
                "Value": "true"
                },
                {
                "Name": "phone_number",
                "Value": "+5521997655616"
                },
                {
                "Name": "email",
                "Value": email
                }
            ],
            "Username": "nbap"
        }


remote_user = TestingRemoteUser(access_token="eyJraWQiOiJpTjJtSFwvTmdHOTQwRE")

def test_remote_user_email(session):
    assert remote_user.email() == email

def test_remote_user_sub(session):
    assert remote_user.sub() == sub

def test_remote_user_sub(session):
    assert session.query(User).filter_by(sub=remote_user.sub()).all() == []

    local_user = remote_user.create_or_get_local()
    user = session.query(User).filter_by(sub=remote_user.sub()).one()

    assert user.email == local_user.email
    assert user.sub == local_user.sub
