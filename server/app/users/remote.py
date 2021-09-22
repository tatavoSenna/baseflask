import random
import secrets
import logging

from functools import wraps

import boto3

from flask import g, current_app, abort
from sqlalchemy.orm.exc import NoResultFound
from flask_awscognito import utils as cognito_utils

from app import db
from app.models.user import User
from app.models.company import Company
from app.serializers.user_serializers import UserSerializer


class RemoteUser:

    client = boto3.client("cognito-idp")

    def __init__(self, request_headers=None, access_token=None):

        if request_headers:
            self.user = self.client.get_user(
                AccessToken=cognito_utils.extract_access_token(request_headers)
            )

        if access_token:
            self.user = self.client.get_user(AccessToken=access_token)

    def info(self):
        return self.user

    def username(self):
        return self.user.get("Username")

    def email(self):
        return self.__extract_user_attributes("email")

    def name(self):
        return self.__extract_user_attributes("name")

    def sub(self):
        return self.__extract_user_attributes("sub")

    """
    Create a user or update attributes on application database
    """

    def create_local(self, company_id):
        local_user = User.query.filter_by(sub=self.sub(), active=True).first()
        default_company = Company.query.filter_by(id="1").first()
        user_attributes = dict(
            username=self.username(), email=self.email(), sub=self.sub(), name=self.name(), verified=False
        )

        if local_user:
            local_user.email = self.email()
        else:
            if not company_id:
                if not default_company:
                    company_id = None
                else:
                    company_id = default_company.id
            user_attributes.update(company_id=company_id)
            local_user = User(**user_attributes)

        db.session.add(local_user)
        db.session.commit()
        return local_user

    def get_local(self):
        try:
            local_user = User.query.filter_by(
                sub=self.sub(), active=True).one()
        except NoResultFound:
            logging.info(
                f'User {self.email()} from cognito not present in database.\nCreating it on company 1.')
            local_user = self.create_local(1)  # creates the user
        local_user.email = self.email()
        db.session.add(local_user)
        db.session.commit()
        return local_user

    """
    Create a user using cognito's API and sync it with the application database
    """

    def create(self, email, name, company_id):
        password = str(random.randint(100000, 999999))

        user_attributes = dict(
            UserPoolId=current_app.config["AWS_COGNITO_USER_POOL_ID"],
            Username=email,
            UserAttributes=[
                {"Name": "email", "Value": email},
                {"Name": "name", "Value": name}
            ],
            TemporaryPassword=password,
        )

        try:
            response = self.client.admin_create_user(**user_attributes)
        except self.client.exceptions.UsernameExistsException:
            logging.info(
                f'User {email} already on cognito. Can´t create. Aborting')
            abort(400, description='Usuário já cadastrado')
        except self.client.exceptions.InvalidPasswordException:
            logging.info(
                f'Can´t create User {email} already on cognito with the provided password')
            abort(
                400, description='A senha fornecida não está de acordo com a noss politica.')

        self.user = response.get("User")
        local_user = self.create_local(company_id)
        return local_user

    def __extract_user_attributes(self, attribute_name):
        user_attributes = self.user.get("UserAttributes", False) or self.user.get(
            "Attributes", []
        )
        for attribute in user_attributes:
            if ("Name" and "Value") in attribute and attribute[
                "Name"
            ] == attribute_name:
                return attribute["Value"]

        return None

    def resend_user_invite(self, username):
        user_attributes = dict(
            UserPoolId=current_app.config["AWS_COGNITO_USER_POOL_ID"],
            Username=username,
            MessageAction='RESEND'
        )
        try:
            response = self.client.admin_create_user(**user_attributes)
        except Exception as e:
            logging.exception(e)
            abort(400, description='Ocorreu um erro na solicitação.')

        return response


def get_local_user(view):
    @wraps(view)
    def decorated(*args, **kwargs):

        user_data_from_cognito_jwt = g.cognito_claims
        user_model_instance = User.query.filter_by(
            sub=user_data_from_cognito_jwt["sub"]
        ).one()
        serialized_user = UserSerializer().dump(user_model_instance)

        return view(serialized_user, *args, **kwargs)

    return decorated
