import json
from app.models.user import User
from app.models.documents import DocumentModel
from app.models.documents import Document
from app.models.client import Client
from app import db

def get_user(email):
    user = User.query.filter_by(email=email).first()

    data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "client_id": user.client_id,
    }

    return data

def get_document_models(client_id, *doc_id):
    if doc_id:
        document_models = DocumentModel.query.filter_by(client_id=client_id, id=doc_id).all()
    else:
        document_models = DocumentModel.query.filter_by(client_id=client_id).all()
        
    data = []
    for document_model in document_models:
        data.append(
            {
            "id": document_model.id,
            "client_id": document_model.client_id,
            "name": document_model.name,
            "filename": document_model.filename,
            }
        )

    return data

def get_documents(client_id):
    documents = Document.query.filter_by(client_id=client_id).join(DocumentModel, Document.document_model_id==DocumentModel.id).order_by(Document.created_at.desc()).limit(5)

    data = []
    for document in documents:
        document_model = DocumentModel.query.get(document.document_model_id)
        data.append(
            {
            "id": document.id,
            "client_id": document.client_id,
            "user_id": document.user_id,
            "document_model_id": document.document_model_id,
            "questions": document.questions,
            "created_at": document.created_at,
            "name": document_model.name,
            "filename": document_model.filename,
            }
        )

    return data

def create_document(client_id, user_id, document_model_id, questions):
    document = Document(user_id=user_id, client_id=client_id, document_model_id=document_model_id, questions=str(questions))
    db.session.add(document)
    db.session.commit()
    