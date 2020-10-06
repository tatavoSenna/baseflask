from app.test import factories
from app.users.controllers import (
    add_user_to_group_controller,
    list_users_on_group_controller,
    remove_user_from_group_controller
)
from app.models.user import Group, User, ParticipatesOn


def test_add_user_to_group():
    company = factories.CompanyFactory()
    group = factories.GroupFactory(company=company)
    user = factories.UserFactory(company=company)
    user2 = factories.UserFactory(company=company)

    user_groups = ParticipatesOn.query.all()
    assert len(user_groups) == 0

    add_user_to_group_controller(group.id, user.id)
    add_user_to_group_controller(group.id, user2.id)
    user_groups = ParticipatesOn.query.all()
    assert len(user_groups) == 2


def test_retrive_users_on_group():
    company = factories.CompanyFactory()
    group = factories.GroupFactory(company=company)
    group2 = factories.GroupFactory(company=company)
    user = factories.UserFactory(company=company)
    user2 = factories.UserFactory(company=company)

    user_list = list_users_on_group_controller(group.id)
    assert user_list.total == 0

    factories.ParticipatesOnFactory(users=user, groups=group)
    factories.ParticipatesOnFactory(users=user2, groups=group)
    factories.ParticipatesOnFactory(users=user, groups=group2)

    user_list = list_users_on_group_controller(group.id)
    assert user_list.total == 2


def test_remove_user_from_group():
    company = factories.CompanyFactory()
    group = factories.GroupFactory(company=company)
    user = factories.UserFactory(company=company)
    user2 = factories.UserFactory(company=company)

    factories.ParticipatesOnFactory(users=user, groups=group)
    factories.ParticipatesOnFactory(users=user2, groups=group)

    user_groups = ParticipatesOn.query.all()
    assert len(user_groups) == 2

    remove_user_from_group_controller(group.id, user.id)
    user_groups = ParticipatesOn.query.all()
    assert len(user_groups) == 1

    assert user_groups[0].user_id == user2.id
