from app.users.controllers import list_user_controller
from app.test import factories


def add_n_random_users(n, company):
    for i in range(n):
        factories.UserFactory(company=company)


def test_retrieve_with_empty_database():
    company = factories.CompanyFactory(id=1)
    logged_user = {'company_id': company.id}

    paginated_query1 = list_user_controller(logged_user)
    assert paginated_query1.total == 0


def test_retrieve_all_users_pagination():
    number_of_users = 25
    company = factories.CompanyFactory(id=1)
    logged_user = {'company_id': company.id}
    add_n_random_users(number_of_users, company)

    paginated_query2 = list_user_controller(logged_user)
    paginated_query3 = list_user_controller(logged_user, page=1, per_page=15)
    paginated_query4 = list_user_controller(logged_user, page=2, per_page=15)

    assert paginated_query2.total == number_of_users
    assert len(paginated_query3.items) == 15
    assert len(paginated_query4.items) == 10


def test_retrieve_specific_users():
    company = factories.CompanyFactory(id=1)
    logged_user = {'company_id': company.id}

    factories.UserFactory(
        company=company,
        email='testing@testCorp.com',
        username='b1',
        name='tester1',
        surname='b1',
    )
    factories.UserFactory(
        company=company,
        email='test@testCorp.com',
        username='b2',
        name='tester2',
        surname='b2',
    )

    paginated_query2 = list_user_controller(logged_user)
    paginated_query3 = list_user_controller(logged_user, search_param='')
    paginated_query4 = list_user_controller(logged_user, search_param='Mamão')
    paginated_query5 = list_user_controller(logged_user, search_param='téstẽr')
    paginated_query6 = list_user_controller(
        logged_user, search_param='@testCorp')
    paginated_query7 = list_user_controller(
        logged_user, search_param='tEsTeR2')

    assert paginated_query2.total == 2
    assert paginated_query3.total == 2
    assert paginated_query4.total == 0
    assert paginated_query5.total == 0
    assert paginated_query6.total == 2
    assert paginated_query7.total == 1
