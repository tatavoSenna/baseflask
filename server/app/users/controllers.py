from app import db
from app.models.user import User, Group
from flask import jsonify


def list_user_group_controller(logged_user, page=1, per_page=20, search_param=''):
    user_groups = Group.query.filter_by(
        company_id=logged_user.get("company_id", -1), active=True
    )

    return user_groups


def create_user_group_controller(name, company_id):
    new_user_group = Group(name=name, company_id=company_id)
    db.session.add(new_user_group)
    db.session.commit()
    return new_user_group


def get_user_group_controller(logged_user, user_group_id):
    user_group = Group.query.filter_by(
        company_id=logged_user.get("company_id", -1), active=True
    ).filter_by(id=user_group_id).first()
    users = User.query.filter_by(user_group_id=user_group.id).all()
    
    return user_group, users


def delete_user_group_controller(user_group):
    user_group.active = False
    db.session.add(user_group)
    db.session.commit()
