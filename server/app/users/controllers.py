from app import db
from app.models.user import User, Group
from flask import jsonify


def list_group_controller(logged_user, page=1, per_page=20, search_param=''):
    groups = Group.query.filter_by(
        company_id=logged_user.get("company_id", -1), active=True
    ).all()
    print(Group.query.all(), logged_user.get("company_id", -1))

    return groups


def create_group_controller(name, company_id):
    new_group = Group(name=name, company_id=company_id)
    db.session.add(new_group)
    db.session.commit()
    return new_group


def get_group_controller(logged_user, group_id):
    group = Group.query.filter_by(
        company_id=logged_user.get("company_id", -1), active=True
    ).filter_by(id=group_id).first()

    return group


def delete_group_controller(group):
    group.active = False
    db.session.add(group)
    db.session.commit()
