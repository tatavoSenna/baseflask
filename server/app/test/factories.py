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
        model = models.user.User

    id = factory.Sequence(lambda n: n)
    sub = factory.Faker("uuid4")
    name = factory.Faker("first_name_nonbinary")
    surname = factory.Faker("last_name_nonbinary")
    email = factory.Faker("email")
    username = factory.Faker("slug")
    company = factory.SubFactory(CompanyFactory)


class GroupFactory(BaseFactory):
    class Meta:
        model = models.user.Group

    id = factory.Sequence(lambda n: n)
    name = factory.Faker("company")
    company = factory.SubFactory(CompanyFactory)


class ParticipatesOnFactory(BaseFactory):
    class Meta:
        model = models.user.ParticipatesOn

    id = factory.Sequence(lambda n: n)
    groups = factory.SubFactory(GroupFactory)
    users = factory.SubFactory(UserFactory)
    
class DocumentTemplateFactory(BaseFactory):
    class Meta:
        model = models.documents.DocumentTemplate

    id = factory.Sequence(lambda n: n)
    name = factory.Faker("first_name_nonbinary")
    filename = factory.Faker("last_name_nonbinary")
    company = factory.SubFactory(CompanyFactory)

class DocumentFactory(BaseFactory):
    class Meta:
        model = models.documents.Document

    id = factory.Sequence(lambda n: n)
    company = factory.SubFactory(CompanyFactory)
    user = factory.SubFactory(UserFactory)
    template = factory.SubFactory(DocumentTemplateFactory)
