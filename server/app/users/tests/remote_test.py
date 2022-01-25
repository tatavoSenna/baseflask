from threading import local
import pytest

import botocore.session

from faker import Faker

from app.models import User, Company
from app.test import factories
from app.users.remote import RemoteUser, get_local_user
from unittest.mock import patch
from app import db
from app.serializers.user_serializers import UserSerializer

fake = Faker()
email = fake.email()
sub = fake.uuid4()
username = fake.slug()
name = 'Nome Sobrenome'
token = "eyJraWQiOiJpTjJtSFwvTmdHOTQwRE"
user_attributes = {
    "Username": username,
    "UserAttributes": [
        {"Name": "sub", "Value": sub},
        {"Name": "email_verified", "Value": "true"},
        {"Name": "phone_number_verified", "Value": "true"},
        {"Name": "phone_number", "Value": "+5521997655616"},
        {"Name": "email", "Value": email},
        {"Name": "name", "Value": name}
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


def test_remote_create_local_user_sub(session):
    company_id = 123
    factories.CompanyFactory(id=company_id)
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
    assert updated_user.name != name


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


def test_get_local_creates_user(session):
    assert session.query(Company).all() == []
    factories.CompanyFactory(id=1)
    assert session.query(User).filter_by(sub=remote_user.sub()).all() == []
    TestingRemoteUser(access_token=token).get_local()
    local_user = session.query(User).filter_by(sub=remote_user.sub()).one()
    assert local_user.email == email
    assert local_user.name == name

@patch('app.users.remote.get_cognito_claims')
def test_get_local_user(cognito_claims_mock, session):

    @get_local_user()
    def raise_forbidden_true_test(local_user):
        return local_user
    
    assert raise_forbidden_true_test() == ({}, 403)

    company_id = 123
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=42, company=company, email="testemail@gmail.com")
    db.session.commit()

    searched_user = session.query(User).filter_by(sub=user.sub).one()

    assert searched_user.email == user.email

    user_info = {
        "verified": searched_user.verified,
        "name": searched_user.name,
        "username": searched_user.username,
        "id": searched_user.id,
        "active": searched_user.active,
        "participates_on": searched_user.participates_on,
        "is_admin": searched_user.is_admin,
        "company_id": searched_user.company_id,
        "email": searched_user.email,
        "sub": searched_user.sub
    }

    cognito_claims_mock.return_value = user_info

    @get_local_user()
    def user_already_exists_test(local_user):
        return local_user

    assert cognito_claims_mock.called
    assert cognito_claims_mock.return_value == user_info
    assert user_already_exists_test()["created"] == True
