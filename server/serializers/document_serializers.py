from app import ma
from app.models.documents import Document, DocumentVersion
from app.serializers.user_serializers import UserSerializer

class DocumentVersionSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=DocumentVersion

class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    versions = ma.Nested(DocumentVersionSerializer, many=True, exclude=('answers',))
    user = ma.Nested(UserSerializer)
    class Meta: 
        model = Document
        include_fk = True
        include_relationships = True