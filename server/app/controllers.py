import json

from app import db
from app.models.company import Company
from app.models.documents import Document, DocumentTemplate, DocumentVersion
from app.models.user import User
from app.serializers.document_serializers import DocumentSerializer


def get_user(email):
    user = User.query.filter_by(email=email).first()

    data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "email": user.email,
        "company_id": user.company_id,
    }

    return data


def get_document_templates(company_id, *doc_id):
    if doc_id:
        document_templates = DocumentTemplate.query.filter_by(
            company_id=company_id, id=doc_id
        ).all()
    else:
        document_templates = DocumentTemplate.query.filter_by(
            company_id=company_id
        ).all()

    data = []
    for document_template in document_templates:
        data.append(
            {
                "id": document_template.id,
                "company_id": document_template.company_id,
                "name": document_template.name,
                "filename": document_template.filename,
            }
        )

    return data


def get_documents(company_id):
    documents = (
        Document.query.filter_by(company_id=company_id)
        .join(DocumentTemplate, Document.document_template_id == DocumentTemplate.id)
        .order_by(Document.created_at.desc())
        .limit(5)
    )

    data = []
    for document in documents:
        document_template = DocumentTemplate.query.get(document.document_template_id)
        data.append(
            {
                "id": document.id,
                "company_id": document.company_id,
                "user_id": document.user_id,
                "document_template_id": document.document_template_id,
                "questions": document.questions,
                "created_at": document.created_at,
                "name": document_template.name,
                "filename": document_template.filename,
            }
        )

    return data


def create_document(
    company_id, user_id, title, document_template_id, answers, filename
):
    new_document = Document(
        user_id=user_id,
        company_id=company_id,
        title=title,
        document_template_id=document_template_id,
    )
    db.session.add(new_document)
    db.session.commit()
    first_version = DocumentVersion(
        filename=filename, answers=answers, document=new_document
    )
    db.session.add(first_version)
    db.session.commit()
    db.session.refresh(new_document)

    return DocumentSerializer().dump(new_document)
