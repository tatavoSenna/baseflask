from app.models.user import User
from sqlalchemy import or_
from flask import jsonify
from app.serializers.user_serializers import UserSerializer


def list_user_controller(logged_user, page=1, per_page=20, search_param=''):
    paginated_query = (
        User.query.filter_by(company_id=logged_user["company_id"])
        .filter(or_(User.name.ilike(f"%{search_param}%"),
                    User.surname.ilike(f"%{search_param}%"),
                    User.email.ilike(f"%{search_param}%")))
        .order_by(User.name)
        .paginate(page=page, per_page=per_page)
    )

    return paginated_query
