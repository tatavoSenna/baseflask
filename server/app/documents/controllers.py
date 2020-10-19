import json

from app import db
from app.models.documents import Document, DocumentTemplate, DocumentVersion
from app.serializers.document_serializers import (
    DocumentSerializer,
    DocumentVersionSerializer,
)


def get_document_templates_controller(company_id, *doc_id):
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




def create_document(
    company_id,
    user_id,
    title,
    document_template_id,
):
    document = Document(
        user_id=user_id,
        company_id=company_id,
        title=title,
        document_template_id=document_template_id,
    )
    db.session.add(document)
    db.session.commit()

    return document


def create_new_version_controller(document, **kwargs):
    version = DocumentVersion(document=document, **kwargs)
    db.session.add(version)
    db.session.commit()
    db.session.refresh(document)

    return version

def get_document_controller(document_id):
    document = Document.query.get(document_id)
    return document
