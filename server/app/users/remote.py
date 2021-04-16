import random
import secrets

from functools import wraps

import boto3

from flask import g, current_app
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

    def create_or_get_local(self):
        local_user = User.query.filter_by(sub=self.sub(), active=True).first()
        default_company = Company.query.filter_by(id="1").first()
        user_attributes = dict(
            username=self.username(), email=self.email(), sub=self.sub(), name=self.name()
        )

        if local_user:
            local_user.email = self.email()

        else:
            company_id = default_company.id if default_company else None
            user_attributes.update(company_id=company_id)
            local_user = User(**user_attributes)

        db.session.add(local_user)
        db.session.commit()
        return local_user

    """
    Create a user using cognito's API and sync it with the application database
    """

    def create(self, email, name):
        username = email.split("@")[0] + "_" + str(random.randint(1000, 9999))
        password = secrets.token_urlsafe(12) + "*" + str(random.randint(10, 99))

        user_attributes = dict(
            UserPoolId=current_app.config["AWS_COGNITO_USER_POOL_ID"],
            Username=username,
            UserAttributes=[
                {"Name": "email", "Value": email},
            ],
            ValidationData=[
                {"Name": "name", "Value": name},
            ],
            TemporaryPassword=password,
        )

        try:
            response = self.client.admin_create_user(**user_attributes)
        except self.client.exceptions.UsernameExistsException as identifier:
            return dict(error="Username already exists")

        self.user = response.get("User")
        local_user = self.create_or_get_local()

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
