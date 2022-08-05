from app import ma
from app.models.internal_database import *
from app.serializers.company_serializers import TagSerializer


class InternalDBSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = ("company_id",)
        model = InternalDatabase


class InternalDBListSerializer(ma.SQLAlchemyAutoSchema):
    text_count = ma.Method("get_text_count")

    class Meta:
        exclude = ("company_id",)
        model = InternalDatabase

    def get_text_count(self, obj):
        return obj.text_items.count()


class TextItemTagSerializer(ma.SQLAlchemyAutoSchema):
    id = ma.Function(lambda obj: obj.tag.id)
    title = ma.Function(lambda obj: obj.tag.title)
    config = ma.Function(lambda obj: obj.tag.config)

    class Meta:
        model = TextItemTag


class TextItemSerializer(ma.SQLAlchemyAutoSchema):
    text_item_tags = ma.Nested(TextItemTagSerializer, many=True, data_key="tags")

    class Meta:
        exclude = ("internal_database_id",)
        model = TextItem


class TextItemListSerializer(ma.SQLAlchemyAutoSchema):
    text_item_tags = ma.Nested(TextItemTagSerializer, many=True, data_key="tags")

    class Meta:
        exclude = (
            "internal_database_id",
            "text",
        )
        model = TextItem
