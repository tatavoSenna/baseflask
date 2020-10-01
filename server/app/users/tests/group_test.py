from app.test import factories
from app.users.controllers import (
    list_group_controller,
    create_group_controller,
    get_group_controller,
    delete_group_controller
)
from app.models.user import Group


def test_create_and_retrieve_group():
    company_id = 1
    company = factories.CompanyFactory(id=company_id)
    name = 'Dept'

    group = create_group_controller(company.id, name)
    retrieved_group = get_group_controller(company.id, group.id)

    assert retrieved_group.company_id == company_id
    assert retrieved_group.name == name


def test_list_groups():
    company_id = 1
    company = factories.CompanyFactory(id=company_id)

    groups = list_group_controller(company.id)
    assert len(groups) == 0

    factories.GroupFactory(company=company)
    factories.GroupFactory(company=company)

    groups = list_group_controller(company.id)
    assert len(groups) == 2


def test_delete_group():
    company_id = 1
    company = factories.CompanyFactory(id=company_id)

    factories.GroupFactory(id=1, company=company)
    factories.GroupFactory(id=2, company=company)
    factories.GroupFactory(id=3, company=company)

    groups = list_group_controller(company.id)
    assert len(groups) == 3

    group_to_delete = Group.query.get(2)
    delete_group_controller(group_to_delete)

    groups = list_group_controller(company.id)
    assert len(groups) == 2
