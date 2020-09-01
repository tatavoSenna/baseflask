import json

from app import db
from app.models.company import Company
from app.models.documents import Document, DocumentModel, DocumentVersion
from app.models.user import User
from app.serializers.document_serializers import DocumentSerializer


def get_user(email):
    user = User.query.filter_by(email=email).first()

    data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "company_id": user.company_id
    }

    return data


def get_document_models(company_id, *doc_id):
    if doc_id:
        document_models = DocumentModel.query.filter_by(
            company_id=company_id, id=doc_id).all()
    else:
        document_models = DocumentModel.query.filter_by(
            company_id=company_id).all()

    data = []
    for document_model in document_models:
        data.append(
            {
                "id": document_model.id,
                "company_id": document_model.company_id,
                "name": document_model.name,
                "filename": document_model.filename,
            }
        )

    return data


def get_documents(company_id):
    documents = Document.query.filter_by(company_id=company_id).join(
        DocumentModel, Document.document_model_id == DocumentModel.id).order_by(Document.created_at.desc()).limit(5)

    data = []
    for document in documents:
        document_model = DocumentModel.query.get(document.document_model_id)
        data.append(
            {
                "id": document.id,
                "company_id": document.company_id,
                "user_id": document.user_id,
                "document_model_id": document.document_model_id,
                "questions": document.questions,
                "created_at": document.created_at,
                "name": document_model.name,
                "filename": document_model.filename,
            }
        )

    return data


def create_document(company_id, user_id, title, document_model_id, answers, filename):
    new_document = Document(
        user_id=user_id,
        company_id=company_id,
        title=title,
        document_model_id=document_model_id
    )
    db.session.add(new_document)
    db.session.commit()
    first_version = DocumentVersion(
        filename = filename,
        answers = answers,
        document = new_document
    )
    db.session.add(first_version)
    db.session.commit()
    db.session.refresh(new_document)

    return DocumentSerializer().dump(new_document)
