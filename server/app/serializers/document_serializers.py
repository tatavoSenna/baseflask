import json
from app import ma
from app.models.documents import Document, DocumentVersion, DocumentTemplate
from app.serializers.user_serializers import UserSerializer

class DocumentVersionSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=DocumentVersion

class DocumentTemplateSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model=DocumentTemplate

class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    versions = ma.Nested(DocumentVersionSerializer, many=True, exclude=('answers',))
    model=ma.Nested(DocumentTemplateSerializer)
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

