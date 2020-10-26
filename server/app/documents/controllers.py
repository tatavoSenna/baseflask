import json

from app import db
from app.models.documents import Document, DocumentTemplate
from app.serializers.document_serializers import (
    DocumentSerializer
)


def get_document_template_list_controller(company_id):
   
    document_templates = DocumentTemplate.query.filter_by(
        company_id=company_id
    ).all()
    return document_templates


def get_document_template_details_controller(company_id, template_id):
    
    document_template = DocumentTemplate.query.filter_by(
        company_id=company_id, id=template_id
    ).first()
  
    return document_template

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


def get_document_controller(document_id):
    document = Document.query.get(document_id)
    return document
