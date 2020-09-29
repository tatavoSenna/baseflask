from app.models.user import User


def get_user(email):
    user = User.query.filter_by(email=email).first()

    data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "company_id": user.company_id,
    }

    return data
