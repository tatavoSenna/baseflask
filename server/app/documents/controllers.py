import json
import uuid
from datetime import datetime

from app import db
from app.constants import months
from app.models.documents import Document, DocumentTemplate
from .remote import RemoteDocument
from app.serializers.document_serializers import (
    DocumentSerializer
)
import copy


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

def create_document_controller(user_id, company_id, variables, document_template_id):
    document_template = DocumentTemplate.query.get(document_template_id)
    title = f"{document_template.name}-{uuid.uuid1()}"

    current_date_dict = get_current_date_dict()
    variables.update(current_date_dict)

    document = Document(
        user_id=user_id,
        company_id=company_id,
        form=document_template.form,
        workflow=document_template.workflow,
        signers=document_template.signers,
        variables=variables,
        title=title,
        document_template_id=document_template_id,
    )
    db.session.add(document)
    db.session.commit()

    remote_document = RemoteDocument()
    remote_document.create(document)

    return document


def get_current_date_dict():
    date = {}

    now = datetime.now()
    date["day"] = str(now.day).zfill(2)
    date["month"] = months[now.month - 1]
    date["year"] = now.year
    date[
        "today"
    ] = f'{ date["day"] }/{ date["month"] }/{ date["year"] }'

    return date


def get_document_controller(document_id):
    document = Document.query.get(document_id)
    return document


def edit_signers_controller(document_id, patched_signers):
    document = Document.query.get(document_id)
    document.signers = copy.deepcopy(document.signers)

    new_signers = [
        find_signer_by_id(
            signer['id'],
            patched_signers,
            default=signer
        ) for signer in document.signers
    ]

    for i in range(len(document.signers)):
        document.signers[i].update(new_signers[i])

    db.session.add(document)
    db.session.commit()

    return document


def find_signer_by_id(signer_id, signers, default=None):
    for signer in signers:
        if signer['id'] == signer_id:
            return signer
    return default
