from app import ma
from models.documents import Document

class DocumentSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
        include_fk = True