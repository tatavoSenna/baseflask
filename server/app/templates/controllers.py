from app import db
from app.models.documents import DocumentTemplate
from unittest.mock import MagicMock
import boto3
import io
from app.models.user import User, Group
from app.workflow.services import (
    format_workflow_responsible_group,
    format_workflow_responsible_users,
)

from .remote import RemoteTemplate


def create_template_controller(
    company_id, user_id, name, form, workflow, signers, text, text_type, variables
):
    for node in workflow["nodes"]:
        responsible_group = workflow["nodes"][node]["responsible_group"]
        if type(responsible_group) is str:
            responsible_group = {"id": responsible_group}
        workflow["nodes"][node][
            "responsible_group"
        ] = format_workflow_responsible_group(responsible_group)
        responsible_users = workflow["nodes"][node]["responsible_users"]
        workflow["nodes"][node][
            "responsible_users"
        ] = format_workflow_responsible_users(responsible_users, responsible_group)

    document_template = DocumentTemplate(
        company_id=company_id,
        user_id=user_id,
        name=name,
        form=form,
        workflow=workflow,
        signers=signers,
        text_type=text_type,
        variables=variables,
    )

    db.session.add(document_template)
    db.session.commit()

    if text_type == ".txt":
        remote_template = RemoteTemplate()
        remote_template.upload_template(text, document_template.id, company_id)

    return document_template.id


def edit_template_controller(
    company_id,
    user_id,
    template_id,
    name,
    form,
    workflow,
    signers,
    text,
    text_type,
    variables,
):
    template = DocumentTemplate.query.filter_by(id=template_id).first()

    if template.company_id != company_id:
        raise Exception("Invalid company")

    for node in workflow["nodes"]:
        responsible_group = workflow["nodes"][node]["responsible_group"]
        if type(responsible_group) is str:
            responsible_group = {"id": responsible_group}
        workflow["nodes"][node][
            "responsible_group"
        ] = format_workflow_responsible_group(responsible_group)
        responsible_users = workflow["nodes"][node]["responsible_users"]
        workflow["nodes"][node][
            "responsible_users"
        ] = format_workflow_responsible_users(responsible_users, responsible_group)

    template.name = name
    template.form = form
    template.workflow = workflow
    template.text = text
    template.signers = signers
    template.text_type = text_type
    template.variables = variables
    db.session.commit()

    if text_type == ".txt":
        remote_template = RemoteTemplate()
        remote_template.upload_template(text, template.id, template.company_id)

    return template.id


def get_template_controller(company_id, document_template_id):
    document_template = DocumentTemplate.query.filter_by(
        company_id=company_id, id=document_template_id
    ).first()
    return document_template


def download_template_text_controller(company_id, template_id):
    template = get_template_controller(company_id, template_id)
    remote_template = RemoteTemplate()
    textfile = remote_template.download_text_from_template(template)
    return textfile


def delete_template_controller(document_template):
    if not isinstance(document_template, MagicMock):
        db.session.delete(document_template)
        db.session.commit()
    remote_template = RemoteTemplate()
    remote_template.delete_template(document_template)


def upload_file_to_template_controller(uploaded_file, filename, file_root, template_id):
    document_template = DocumentTemplate.query.filter_by(id=template_id).first()
    document_template.filename = file_root
    db.session.commit()

    remote_template = RemoteTemplate()
    remote_template.upload_file_template(
        uploaded_file, filename, document_template.id, document_template.company_id
    )


def get_document_upload_url(template):
    remote_template = RemoteTemplate()
    doc_url = remote_template.download_file_template(template)
    return doc_url


def template_status_controller(company_id, user_id, template_id, status):
    template = DocumentTemplate.query.filter_by(id=template_id).first()

    if template.company_id != company_id:
        raise Exception("Invalid company")

    template.published = status
    db.session.commit()

    return template.id
