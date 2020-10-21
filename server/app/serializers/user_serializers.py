from app import ma
from app.models.user import User, Group, ParticipatesOn


class GroupSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Group


class ParticipatesOnSerializer(ma.SQLAlchemyAutoSchema):
    group_id = ma.Function(lambda obj: obj.group.id)
    name = ma.Function(lambda obj: obj.group.name)
    active = ma.Function(lambda obj: obj.group.active)

    class Meta:
        exclude = (
            "id",
        )
        model = ParticipatesOn


class UserSerializer(ma.SQLAlchemyAutoSchema):
    participates_on = ma.Nested(ParticipatesOnSerializer, many=True)

    class Meta:
        exclude = (
            "docusign_token",
            "docusign_refresh_token",
            "docusign_token_obtain_date",
            "sub",
        )
        model = User
        include_fk = True
