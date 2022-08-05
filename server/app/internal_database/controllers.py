from app.models import internal_database
from werkzeug.exceptions import BadRequest, NotFound, Forbidden
from sqlalchemy import desc, asc, select, delete

from app import db
from app.models.user import User
from app.models.internal_database import *
from app.models.company import Tag


def get_internal_db_controller(user, db_id):
    internal_db = InternalDatabase.query.get(db_id)

    if not internal_db:
        raise NotFound()

    if user.company_id != internal_db.company_id:
        raise Forbidden()

    return internal_db


def list_internal_db_controller(user, page, per_page, search_term, order_by, order):
    internal_db_query = InternalDatabase.query.filter_by(company_id=user.company_id)

    if search_term:
        internal_db_query = internal_db_query.filter(
            InternalDatabase.title.ilike(f"%{search_term}%")
        )

    order_by_dict = {
        "title": InternalDatabase.title,
        "created_at": InternalDatabase.created_at,
        "created_by": User.name,
    }
    order_dict = {
        "ascend": asc(order_by_dict[order_by]),
        "descend": desc(order_by_dict[order_by]),
    }

    if order_by == "created_by":
        internal_db_query = internal_db_query.join(InternalDatabase.created_by)

    internal_db_query = internal_db_query.order_by(order_dict[order])

    return internal_db_query.paginate(page=page, per_page=per_page)


def create_internal_db_controller(user, data):
    title = data.get("title", None)
    if not title:
        raise BadRequest()

    table_type = data.get("table_type", "text")

    internal_db = InternalDatabase(
        company_id=user.company_id,
        title=title,
        table_type=table_type,
        created_by_id=user.id,
    )

    db.session.add(internal_db)
    db.session.commit()

    return internal_db


def update_internal_db_controller(user, data, db_id):
    title = data.get("title", None)
    if not title:
        raise BadRequest()

    internal_db = InternalDatabase.query.get(db_id)

    if not internal_db:
        raise NotFound()

    if user.company_id != internal_db.company_id:
        raise Forbidden()

    internal_db.title = title

    db.session.commit()

    return internal_db


def delete_internal_db_controller(user, db_id):
    internal_db = InternalDatabase.query.get(db_id)

    if not internal_db:
        raise NotFound()

    if user.company_id != internal_db.company_id:
        raise Forbidden()

    if internal_db.table_type == "text":
        if db.session.query(
            select(TextItem).where(TextItem.internal_database_id == db_id).exists()
        ).scalar():
            raise BadRequest()

    db.session.delete(internal_db)
    db.session.commit()


def get_text_item_controller(user, text_item_id):
    text_item = TextItem.query.get(text_item_id)

    if not text_item:
        raise NotFound()

    if user.company_id != text_item.internal_database.company_id:
        raise Forbidden()

    return text_item


def list_text_items_from_internal_db_controller(
    user, db_id, page, per_page, search_term, order_by, order, tag_ids=[]
):

    text_items_query = TextItem.query.filter_by(internal_database_id=db_id)

    for tag_id in tag_ids:
        text_items_query = text_items_query.filter(
            TextItem.text_item_tags.any(tag_id=tag_id)
        )

    if search_term:
        text_items_query = text_items_query.filter(
            TextItem.description.ilike(f"%{search_term}%")
        )

    order_by_dict = {
        "description": TextItem.description,
        "created_at": TextItem.created_at,
        "created_by": User.name,
    }
    order_dict = {
        "ascend": asc(order_by_dict[order_by]),
        "descend": desc(order_by_dict[order_by]),
    }

    if order_by == "created_by":
        text_items_query = text_items_query.join(TextItem.created_by)

    text_items_query = text_items_query.order_by(order_dict[order])

    return text_items_query.distinct().paginate(page=page, per_page=per_page)


def create_text_item_controller(user, data):
    db_id = data.get("internal_database_id", None)
    if not db_id:
        raise BadRequest()

    description = data.get("description", None)
    if not description:
        raise BadRequest()

    text = data.get("text", None)
    if not text:
        raise BadRequest()

    internal_db = InternalDatabase.query.get(db_id)

    if not internal_db:
        raise NotFound()

    if user.company_id != internal_db.company_id:
        raise Forbidden()

    text_item = TextItem(
        internal_database_id=internal_db.id,
        description=description,
        text=text,
        created_by_id=user.id,
    )

    db.session.add(text_item)
    db.session.flush()

    tag_ids = data.get("tag_ids", [])
    if tag_ids != [] and type(tag_ids) is list:
        for tag_id in tag_ids:
            if type(tag_id) is int:
                text_item_tag = TextItemTag(text_item_id=text_item.id, tag_id=tag_id)
                db.session.add(text_item_tag)

    db.session.commit()

    return text_item


def update_text_item_controller(user, text_item_id, data):
    description = data.get("description", None)
    text = data.get("text", None)
    tag_ids = data.get("tag_ids", [])

    if not description and not text and tag_ids == []:
        raise BadRequest()

    text_item = TextItem.query.get(text_item_id)

    if not text_item:
        raise NotFound()

    if user.company_id != text_item.internal_database.company_id:
        raise Forbidden()

    if description:
        text_item.description = description

    if text:
        text_item.text = text

    if tag_ids != []:
        db.session.execute(
            delete(TextItemTag).where(TextItemTag.text_item_id == text_item.id)
        )
        for tag_id in tag_ids:
            if type(tag_id) is int:
                text_item_tag = TextItemTag(text_item_id=text_item.id, tag_id=tag_id)
                db.session.add(text_item_tag)

    db.session.commit()

    return text_item


def delete_text_item_controller(user, text_item_id):
    text_item = TextItem.query.get(text_item_id)

    if not text_item:
        raise NotFound()

    if user.company_id != text_item.internal_database.company_id:
        raise Forbidden()

    db.session.execute(
        delete(TextItemTag).where(TextItemTag.text_item_id == text_item.id)
    )
    db.session.delete(text_item)
    db.session.commit()
