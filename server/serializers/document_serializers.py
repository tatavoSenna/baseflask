import json
from app import ma
from app.models.documents import Document, DocumentVersion, DocumentModel
from app.serializers.user_serializers import UserSerializer

class DocumentVersionSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=DocumentVersion

class DocumentModelSerializer(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model=DocumentModel

class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    versions = ma.Nested(DocumentVersionSerializer, many=True, exclude=('answers',))
    model=ma.Nested(DocumentModelSerializer)
    user = ma.Nested(UserSerializer)
    envelope = ma.Method('get_envelope_dict')
    class Meta: 
        model = Document
        include_fk = True
        include_relationships = True

    def get_envelope_dict(self, obj):
        if obj.envelope:
            try:
                envelope_dict = json.loads(obj.envelope)
                return envelope_dict
            except:
                return None
        return None

