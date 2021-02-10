from app.test import factories
from app.users.controllers import (
    list_group_controller,
    create_group_controller,
    get_group_controller,
    delete_group_controller
)
from app.models.user import Group


def add_n_random_groups(n, company):
    for i in range(n):
        factories.GroupFactory(company=company)


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

    paginated_query = list_group_controller(company.id)
    assert paginated_query.total == 0

    factories.GroupFactory(company=company)
    factories.GroupFactory(company=company)

    paginated_query = list_group_controller(company.id)
    assert paginated_query.total == 2


def test_delete_group():
    company_id = 1
    company = factories.CompanyFactory(id=company_id)

    factories.GroupFactory(id=1, company=company)
    factories.GroupFactory(id=2, company=company)
    factories.GroupFactory(id=3, company=company)

    paginated_query = list_group_controller(company.id)
    assert paginated_query.total == 3

    group_to_delete = Group.query.get(2)
    delete_group_controller(group_to_delete)

    paginated_query = list_group_controller(company.id)
    assert paginated_query.total == 2


def test_list_groups_pagination():
    company_id = 17
    company = factories.CompanyFactory(id=company_id)
    number_of_groups = 25

    add_n_random_groups(number_of_groups, company)

    paginated_query1 = list_group_controller(company.id)
    paginated_query2 = list_group_controller(company.id, page=1, per_page=15)
    paginated_query3 = list_group_controller(company.id, page=2, per_page=15)

    assert paginated_query1.total == number_of_groups
    assert len(paginated_query2.items) == 15
    assert len(paginated_query3.items) == 10


def test_retrieve_specific_groups():
    company = factories.CompanyFactory(id=1)

    factories.GroupFactory(
        company=company,
        name='tester1',
    )
    factories.GroupFactory(
        company=company,
        name='tester2',
    )

    paginated_query1 = list_group_controller(company.id)
    paginated_query2 = list_group_controller(company.id, search_param='')
    paginated_query3 = list_group_controller(company.id, search_param='Mamão')
    paginated_query4 = list_group_controller(company.id, search_param='téstẽr')
    paginated_query5 = list_group_controller(
        company.id, search_param='tEsTeR2')

    assert paginated_query1.total == 2
    assert paginated_query2.total == 2
    assert paginated_query3.total == 0
    assert paginated_query4.total == 0
    assert paginated_query5.total == 1
