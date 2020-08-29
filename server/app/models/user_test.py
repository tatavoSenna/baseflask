import pytest

from . import User
from app.test import factories


def test_create_user(session, faker):
   new_user = factories.UserFactory()
   user = session.query(User).filter_by(sub=new_user.sub).one()
   assert user.email == new_user.email
   assert user.sub == new_user.sub
