
from app import db
from app.models.documents import DocumentTemplate

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
