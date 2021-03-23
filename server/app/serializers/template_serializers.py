import json
from app import ma
from app.models.documents import DocumentTemplate


class TemplateSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "created_at",
            "documents",
            "external_tokens"
        )
        model = DocumentTemplate
