
from app.models.documents import Document



def get_document_controller(document_id):
    document = Document.query.get(document_id)
    return document
