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


class CompanyFactory(BaseFactory):
    class Meta:
        model = models.Company

    id = factory.Sequence(lambda n: n)
    name = factory.Faker("company")


class UserFactory(BaseFactory):
    class Meta:
        model = models.User

    id = factory.Sequence(lambda n: n)
    sub = factory.Faker("uuid4")
    name = factory.Faker("first_name_nonbinary")
    surname = factory.Faker("last_name_nonbinary")
    email = factory.Faker("email")
    username = factory.Faker("slug")
    company = factory.SubFactory(CompanyFactory)
