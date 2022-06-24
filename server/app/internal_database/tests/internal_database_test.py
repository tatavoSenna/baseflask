from werkzeug.exceptions import Forbidden, BadRequest, NotFound

from app.internal_database.controllers import *
from app.test import factories
from app.models.internal_database import InternalDatabase, TextItem, TextItemTag


def test_get_internal_db_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company=company_1)
    different_company_user = factories.UserFactory(company=company_2)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )

    response = get_internal_db_controller(same_company_user, db.id)
    assert response.id == db.id

    try:
        response = get_internal_db_controller(different_company_user, db.id)
    except Exception as e:
        assert type(e) is Forbidden

    try:
        response = get_internal_db_controller(same_company_user, db.id + 1)
    except Exception as e:
        assert type(e) is NotFound


def test_list_internal_db_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company_id=company_1.id)
    different_company_user = factories.UserFactory(company_id=company_2.id)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )
    db_2 = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )

    response = list_internal_db_controller(
        same_company_user, 1, 2, None, "created_at", "ascend"
    )

    assert response.total == 2
    assert response.items[0] == db
    assert response.items[1] == db_2


def test_create_internal_db_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(
        company_id=company_1.id, company=company_1
    )
    different_company_user = factories.UserFactory(
        company_id=company_2.id, company=company_2
    )

    data = {"title": "Test", "table_type": "text"}
    response = create_internal_db_controller(same_company_user, data)

    assert response.title == data["title"]
    assert response.company_id == same_company_user.company_id

    response = create_internal_db_controller(different_company_user, data)
    assert response.company_id == different_company_user.company_id
    assert response.title == data["title"]

    data.pop("title")
    try:
        response = create_internal_db_controller(same_company_user, data)
    except Exception as e:
        assert type(e) is BadRequest


def test_update_internal_db_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company=company_1)
    different_company_user = factories.UserFactory(company=company_2)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user, table_type="text"
    )

    data = {"title": "Test", "table_type": "table"}
    response = update_internal_db_controller(same_company_user, data, db.id)
    assert response.title == data["title"]
    assert response.table_type == "text"

    data = {"table_type": "table"}
    try:
        response = update_internal_db_controller(same_company_user, data, db.id)
    except Exception as e:
        assert type(e) is BadRequest

    data = {"title": "Teste 123"}
    try:
        response = update_internal_db_controller(same_company_user, data, db.id + 1)
    except Exception as e:
        assert type(e) is NotFound

    try:
        response = update_internal_db_controller(different_company_user, data, db.id)
    except Exception as e:
        assert type(e) is Forbidden

    assert InternalDatabase.query.filter_by().first().title == "Test"


def test_delete_internal_db_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company=company_1)
    different_company_user = factories.UserFactory(company=company_2)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )

    try:
        response = delete_internal_db_controller(same_company_user, db.id + 1)
    except Exception as e:
        assert type(e) is NotFound

    try:
        response = delete_internal_db_controller(different_company_user, db.id)
    except Exception as e:
        assert type(e) is Forbidden

    response = delete_internal_db_controller(same_company_user, db.id)
    assert InternalDatabase.query.filter_by().first() == None


def test_get_text_item_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company=company_1)
    different_company_user = factories.UserFactory(company=company_2)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )
    text_item = factories.TextItemFactory(
        internal_database_id=db.id, internal_database=db, created_by=same_company_user
    )

    response = get_text_item_controller(same_company_user, text_item.id)
    assert response.id == text_item.id

    try:
        response = get_text_item_controller(different_company_user, text_item.id)
    except Exception as e:
        assert type(e) is Forbidden

    try:
        response = get_text_item_controller(same_company_user, text_item.id + 1)
    except Exception as e:
        assert type(e) is NotFound


def test_list_text_items_from_internal_db_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company_id=company_1.id)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )
    db_2 = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )
    text_item = factories.TextItemFactory(
        internal_database_id=db.id, internal_database=db, created_by=same_company_user
    )

    response = list_text_items_from_internal_db_controller(
        same_company_user, db.id, 1, 2, None, "created_at", "ascend", None
    )

    assert response.total == 1
    assert response.items[0] == text_item

    response = list_text_items_from_internal_db_controller(
        same_company_user, db_2.id, 1, 2, None, "created_at", "ascend", None
    )

    assert response.total == 0


def test_create_text_item_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(
        company_id=company_1.id, company=company_1
    )
    different_company_user = factories.UserFactory(
        company_id=company_2.id, company=company_2
    )
    db = factories.InternalDatabaseFactory(
        id=1, company=company_1, created_by=same_company_user
    )
    db_2 = factories.InternalDatabaseFactory(
        id=2, company=company_1, created_by=same_company_user
    )
    tag = factories.TagFactory(company=company_1, created_by=same_company_user)

    data = {
        "internal_database_id": db.id,
        "description": "Description",
        "text": "A really long text",
        "tag_ids": [tag.id],
    }
    response = create_text_item_controller(same_company_user, data)

    assert response.description == data["description"]
    assert response.text == data["text"]
    assert response.internal_database_id == data["internal_database_id"]
    assert (
        TextItemTag.query.filter_by(text_item_id=response.id, tag_id=tag.id).first()
        is not None
    )

    try:
        response = create_text_item_controller(different_company_user, data)
    except Exception as e:
        assert type(e) is Forbidden

    data["internal_database_id"] = db.id + db_2.id + 1
    try:
        response = create_text_item_controller(same_company_user, data)
    except Exception as e:
        assert type(e) is NotFound

    data.pop("internal_database_id")
    try:
        response = create_text_item_controller(same_company_user, data)
    except Exception as e:
        assert type(e) is BadRequest

    data.pop("description")
    try:
        response = create_text_item_controller(same_company_user, data)
    except Exception as e:
        assert type(e) is BadRequest

    data.pop("text")
    try:
        response = create_text_item_controller(same_company_user, data)
    except Exception as e:
        assert type(e) is BadRequest


def test_update_text_item_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company=company_1)
    different_company_user = factories.UserFactory(company=company_2)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user, table_type="text"
    )
    text_item = factories.TextItemFactory(
        internal_database_id=db.id,
        internal_database=db,
        created_by=same_company_user,
        description="Abc",
        text="Text",
    )
    tag = factories.TagFactory(company=company_1, created_by=same_company_user)
    tag_2 = factories.TagFactory(company=company_1, created_by=same_company_user)
    text_tag = factories.TextItemTagFactory(text_item=text_item, tag=tag)

    data = {
        "description": "Description",
        "text": "A really long text",
        "tag_ids": [tag_2.id],
    }
    response = update_text_item_controller(same_company_user, text_item.id, data)
    assert response.description == data["description"]
    assert response.text == data["text"]
    assert (
        TextItemTag.query.filter_by(text_item_id=text_item.id, tag_id=tag.id).first()
        is None
    )
    assert (
        TextItemTag.query.filter_by(text_item_id=text_item.id, tag_id=tag_2.id).first()
        is not None
    )

    data = {"tag_ids": []}
    try:
        response = update_text_item_controller(same_company_user, text_item.id, data)
    except Exception as e:
        assert type(e) is BadRequest

    data = {"description": "Description 123"}
    try:
        response = update_text_item_controller(
            same_company_user, text_item.id + 1, data
        )
    except Exception as e:
        assert type(e) is NotFound

    try:
        response = update_text_item_controller(
            different_company_user, text_item.id, data
        )
    except Exception as e:
        assert type(e) is Forbidden

    assert TextItem.query.filter_by().first().description == "Description"


def test_delete_text_item_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    same_company_user = factories.UserFactory(company=company_1)
    different_company_user = factories.UserFactory(company=company_2)
    db = factories.InternalDatabaseFactory(
        company=company_1, created_by=same_company_user
    )
    text_item = factories.TextItemFactory(
        internal_database_id=db.id, internal_database=db, created_by=same_company_user
    )

    try:
        response = delete_text_item_controller(same_company_user, text_item.id + 1)
    except Exception as e:
        assert type(e) is NotFound

    try:
        response = delete_text_item_controller(different_company_user, text_item.id)
    except Exception as e:
        assert type(e) is Forbidden

    response = delete_text_item_controller(same_company_user, text_item.id)
    assert TextItem.query.filter_by().first() == None


def test_list_text_items_from_internal_db_based_on_tag_ids_controller():
    company_1 = factories.CompanyFactory()
    company_2 = factories.CompanyFactory()
    user = factories.UserFactory(company_id=company_1.id)
    db = factories.InternalDatabaseFactory(company=company_1, created_by=user)
    db_2 = factories.InternalDatabaseFactory(company=company_1, created_by=user)
    text_item = factories.TextItemFactory(
        internal_database_id=db.id, internal_database=db, created_by=user
    )
    text_item_2 = factories.TextItemFactory(
        internal_database_id=db.id, internal_database=db, created_by=user
    )
    tag = factories.TagFactory(company=company_1, created_by=user)
    tag_2 = factories.TagFactory(company=company_1, created_by=user)
    tag_3 = factories.TagFactory(company=company_1, created_by=user)
    text_item_tag_1 = factories.TextItemTagFactory(text_item=text_item, tag=tag)
    text_item_tag_2 = factories.TextItemTagFactory(text_item=text_item, tag=tag_2)
    text_item_2_tag_3 = factories.TextItemTagFactory(text_item=text_item_2, tag=tag_3)

    response = list_text_items_from_internal_db_controller(
        user, db.id, 1, 2, None, "created_at", "ascend", [tag.id, tag_2.id]
    )

    assert response.total == 1
    assert response.items[0] == text_item

    response = list_text_items_from_internal_db_controller(
        user, db.id, 1, 2, None, "created_at", "ascend", [tag.id]
    )

    assert response.total == 1
    assert response.items[0] == text_item

    response = list_text_items_from_internal_db_controller(
        user, db.id, 1, 2, None, "created_at", "ascend", [tag_3.id]
    )

    assert response.total == 1
    assert response.items[0] == text_item_2

    text_item_tag_3 = factories.TextItemTagFactory(text_item=text_item, tag=tag_3)

    response = list_text_items_from_internal_db_controller(
        user, db.id, 1, 2, None, "created_at", "ascend", [tag_3.id]
    )

    assert response.total == 2

    response = list_text_items_from_internal_db_controller(
        user, db.id, 1, 2, None, "created_at", "ascend", [tag.id, tag_3.id]
    )

    assert response.total == 2
