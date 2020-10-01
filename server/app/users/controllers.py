from app import db
from sqlalchemy import or_
from app.models.user import User, Group
from flask import jsonify
from app.serializers.user_serializers import UserSerializer


def list_user_controller(company_id, page=1, per_page=20, search_param=''):
    paginated_query = (
        User.query.filter_by(company_id=company_id, active=True)
        .filter(or_(User.name.ilike(f"%{search_param}%"),
                    User.surname.ilike(f"%{search_param}%"),
                    User.email.ilike(f"%{search_param}%")))
        .order_by(User.name)
        .paginate(page=page, per_page=per_page)
    )

    return paginated_query


def list_group_controller(company_id, page=1, per_page=20, search_param=''):
    paginated_query = (
        Group.query
        .filter_by(company_id=company_id, active=True)
        .filter(Group.name.ilike(f"%{search_param}%"))
        .order_by(Group.name)
        .paginate(page=page, per_page=per_page)
    )

    return paginated_query


def create_group_controller(company_id, name):
    new_group = Group(name=name, company_id=company_id)
    db.session.add(new_group)
    db.session.commit()
    return new_group


def get_group_controller(company_id, group_id):
    group = Group.query.filter_by(
        company_id=company_id, active=True
    ).filter_by(id=group_id).first()

    return group


def delete_group_controller(group):
    group.active = False
    db.session.add(group)
    db.session.commit()
