from functools import wraps

import boto3

from flask import g
from flask_awscognito import utils as cognito_utils

from app import db
from app.models.user import User
from app.serializers.user_serializers import UserSerializer 


class RemoteUser():

    client = boto3.client('cognito-idp')

    def __init__(self, request_headers=None, access_token=None):

        if request_headers:
            self.user = self.client.get_user(
                AccessToken=cognito_utils.extract_access_token(request_headers)
            )

        if access_token:
            self.user = self.client.get_user(AccessToken=access_token)

    def info(self):
        return self.user

    def email(self):
        return self.__extract_user_attributes("email")

    def sub(self):
        return self.__extract_user_attributes("sub")

    def create_or_get_local(self):
        local_user = User.query.filter_by(sub=self.sub()).first()

        if not local_user:
            local_user = User(
                email=self.email(),
                sub=self.sub()
            )
            db.session.add(local_user)
            db.session.commit()

        return local_user

    def __extract_user_attributes(self, attribute_name):
        for attribute in self.user.get("UserAttributes", []):
            if ("Name" and "Value") in attribute and attribute["Name"] == attribute_name:
                return attribute["Value"]
        return None


def get_local_user(view):
    @wraps(view)
    def decorated(*args, **kwargs):
        
        user_data_from_cognito_jwt = g.cognito_claims
        user_model_instance = User.query.filter_by(sub=user_data_from_cognito_jwt['sub']).one()
        serialized_user = UserSerializer().dump(user_model_instance)
    
        return view(serialized_user, *args, **kwargs) 

    return decorated

        
            
                                


