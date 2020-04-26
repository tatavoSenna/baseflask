from app import ma
from app.models.documents import Document, DocumentVersion

class DocumentVersionSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=DocumentVersion

class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    versions = ma.Nested(DocumentVersionSerializer, many=True, exclude=('answers',))
    class Meta:
        model = Document
        include_fk = True
        include_relationships = True