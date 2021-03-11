
from app import db
from app.models.documents import DocumentTemplate
from unittest.mock import MagicMock

from .remote import RemoteTemplate


def create_template_controller(company_id, user_id, name, form, workflow, signers, text):

    document_template = DocumentTemplate(
        company_id=company_id,
        user_id=user_id,
        name=name,
        form=form,
        workflow=workflow,
        signers=signers
    )

    db.session.add(document_template)
    db.session.commit()

    remote_template = RemoteTemplate()
    remote_template.upload_template(text, document_template.id,document_template.company_id)

    return document_template.id


def get_template_controller(company_id, document_template_id):
    document_template = DocumentTemplate.query.filter_by(
        company_id=company_id, id=document_template_id
    ).first()
    return document_template


def delete_template_controller(document_template):
    if not isinstance(document_template, MagicMock):
        db.session.delete(document_template)
        db.session.commit()
    remote_template = RemoteTemplate()
    remote_template.delete_template(document_template)
