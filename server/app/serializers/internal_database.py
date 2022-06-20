from app import ma
from app.models.internal_database import *
from app.serializers.company_serializers import TagSerializer


class InternalDBSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = ("company_id",)
        model = InternalDatabase


class TextItemSerializer(ma.SQLAlchemyAutoSchema):
    tags = ma.Nested(TagSerializer, many=True)

    class Meta:
        exclude = ("internal_database_id",)
        model = TextItem


class TextItemListSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "internal_database_id",
            "text",
        )
        model = TextItem
