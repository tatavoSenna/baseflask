from app import ma
from app.models.user import User


class UserSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "docusign_token",
            "docusign_refresh_token",
            "docusign_token_obtain_date",
            "sub",
        )
        model = User
        include_fk = True
