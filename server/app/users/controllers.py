from app import db
from sqlalchemy import or_
from app.models.user import User, Group, ParticipatesOn
from flask import jsonify
from app.serializers.user_serializers import UserSerializer
from app.users.remote import RemoteUser


def create_user_controller(email, name, group_ids=None, company_id=None):

    if group_ids:
        groups = {}
        for group_id in group_ids:
            groups[group_id] = Group.query.get(group_id)
            if not groups[group_id]:
                raise Exception("Group not found")

    remote_user = RemoteUser()
    new_user = remote_user.create(email, name)

    if group_ids and groups:
        for group in groups.values():
            db.session.add(ParticipatesOn(
                group_id=group.id, user_id=new_user.id))
        db.session.commit()

    return new_user



def get_user_controller(email):
    user = User.query.filter_by(email=email).first()

    data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "company_id": user.company_id,
    }

    return data

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


def add_user_to_group_controller(group_id, user_id):
    new_participation = ParticipatesOn(group_id=group_id, user_id=user_id)
    db.session.add(new_participation)
    db.session.commit()


def list_users_on_group_controller(group_id, page=1, per_page=20, search_param=""):

    participations = ParticipatesOn.query.filter_by(group_id=group_id).all()
    user_id_list = list(map(
        lambda participation: participation.user_id, participations
    ))

    paginated_query = (
        User.query
        .filter(User.id.in_(user_id_list))
        .filter(or_(User.name.ilike(f"%{search_param}%"),
                    User.surname.ilike(f"%{search_param}%"),
                    User.email.ilike(f"%{search_param}%")))
        .order_by(User.name)
        .paginate(page=page, per_page=per_page)
    )

    return paginated_query


def remove_user_from_group_controller(group_id, user_id):
    participation = ParticipatesOn.query.filter_by(
        group_id=group_id, user_id=user_id).first()
    db.session.delete(participation)
    db.session.commit()


def edit_user_controller(username, company_id=None, group_ids=None):
    user = User.query.filter_by(username=username).first()

    if user.company_id != company_id:
        raise Exception("Invalid company")

    if group_ids:
        new_groups = {}
        for group_id in group_ids:
            new_groups[group_id] = Group.query.get(group_id)

            if not new_groups[group_id]:
                raise Exception(f"Group {group_id} not found")

        for participation in user.participates_on:
            if participation.group.id not in new_groups.keys():
                db.session.delete(participation)
            else:
                new_groups.pop(participation.group.id)

        for group in new_groups.values():
            db.session.add(ParticipatesOn(group_id=group.id, user_id=user.id))

        db.session.commit()

    return user
