from app import ma
from app.models.user import User, UserGroup


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


class UserGroupSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserGroup
        include_fk = True
