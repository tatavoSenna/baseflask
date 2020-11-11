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
    document = Document.query.filter_by(id=document_id).first()
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


def get_document_version_controller(document_id):
    document = get_document_controller(document_id)
    # take size of array with will be version + 1
    versions = document.versions
    current_version = int(versions[len(versions) - 1])
    return current_version


def create_new_version_controller(document_id):
    document = Document.query.filter_by(id=document_id).first()
    versions = document.versions
    current_version = int(versions[len(versions) - 1])
    new_version = current_version + 1
    # need to make a copy to track changes to JSON, otherwise the changes are not updated
    document.versions = copy.deepcopy(document.versions)
    document.versions.append(str(new_version))
    db.session.add(document)
    db.session.commit()


def download_document_text_controller(document_id):
    document = get_document_controller(document_id)
    remote_document = RemoteDocument()
    textfile = remote_document.download_text_from_documents(document)
    return textfile


def upload_document_text_controller(document_id, document_text):
    document = get_document_controller(document_id)
    # convert from string to bytes object
    document_text = bytearray(document_text, encoding='utf8')
    remote_document = RemoteDocument()
    remote_document.upload_filled_text_to_documents(document, document_text)
