import pytest

import botocore.session

from faker import Faker

from app.models import User, Company
from app.test import factories
from app.users.remote import RemoteUser

fake = Faker()
email = fake.email()
sub = fake.uuid4()
username = fake.slug()
token = "eyJraWQiOiJpTjJtSFwvTmdHOTQwRE"
user_attributes = {
    "Username": username,
    "UserAttributes": [
        {"Name": "sub", "Value": sub},
        {"Name": "email_verified", "Value": "true"},
        {"Name": "phone_number_verified", "Value": "true"},
        {"Name": "phone_number", "Value": "+5521997655616"},
        {"Name": "email", "Value": email},
    ],
}


class TestingRemoteUser(RemoteUser):
    client = botocore.session.get_session().create_client("cognito-idp")

    def __init__(self, request_headers=None, access_token=None):
        self.user = user_attributes


remote_user = TestingRemoteUser(access_token=token)


def test_remote_user_email(session):
    assert remote_user.email() == email


def test_remote_user_sub(session):
    assert remote_user.sub() == sub


def test_remote_user_sub(session):
    company_id = 123
    company = factories.CompanyFactory(id=company_id)
    assert session.query(User).filter_by(sub=remote_user.sub()).all() == []

    local_user = remote_user.create_local(company_id)
    user = session.query(User).filter_by(sub=remote_user.sub()).one()
    assert user.email == local_user.email
    assert user.sub == local_user.sub


def test_update_user_when_already_exists(session):
    company_id = 123
    company = factories.CompanyFactory(id=company_id)
    another_email = fake.email()
    factories.UserFactory(username=username, email=another_email, sub=sub)
    remote_user.create_local(company.id)
    updated_user = session.query(User).filter_by(sub=sub).one()
    assert updated_user.email == email
    assert updated_user.email != another_email


def test_create_user_with_default_company(session):
    company_id = None
    factories.CompanyFactory(id=1)
    TestingRemoteUser(access_token=token).create_local(company_id)

    assert session.query(User).filter_by(sub=sub).one().company_id == 1


def test_create_user_without_company(session):
    company_id = None
    assert session.query(Company).all() == []

    TestingRemoteUser(access_token=token).create_local(company_id)

    assert session.query(User).filter_by(sub=sub).one().company_id == None
