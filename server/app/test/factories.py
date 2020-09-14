import factory

from factory.alchemy import SQLAlchemyModelFactory
from flask import current_app
from sqlalchemy.orm.scoping import scoped_session

from app import models


Session = scoped_session(
    lambda: current_app.extensions["sqlalchemy"].db.session,
    scopefunc=lambda: current_app.extensions["sqlalchemy"].db.session,
)

class BaseFactory(SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session = Session

class UserFactory(BaseFactory):
    class Meta:
        model = models.User
        sqlalchemy_get_or_create = ("sub", "email",)

    id = factory.Sequence(lambda n: n)
    sub = factory.Faker("uuid4")
    name = factory.Faker("first_name_nonbinary")
    surname = factory.Faker("last_name_nonbinary")
    email = factory.Faker("email")
