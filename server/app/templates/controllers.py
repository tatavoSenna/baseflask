from black import out
from app import db
from app.models.documents import DocumentTemplate
from unittest.mock import MagicMock
import boto3
import io
from flask import current_app
from sentry_sdk import capture_exception
from app.models.user import User, Group
from app.workflow.services import (
    format_workflow_responsible_group,
    format_workflow_responsible_users,
)
from werkzeug.exceptions import BadRequest

from .remote import RemoteTemplate


def create_template_controller(
    company_id, user_id, name, form, workflow, signers, text, text_type, variables
):
    template = DocumentTemplate.query.filter_by(name=name, company_id=company_id).all()

    if template:
        raise BadRequest(description="There already exists a template with that name")

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


def template_favorite_controller(company_id, template_id, status):
    template = DocumentTemplate.query.filter_by(id=template_id).first()

    if template.company_id != company_id:
        raise Exception("Invalid company")

    template.favorite = status
    db.session.commit()

    return template.id


def duplicate_template(template, user_id, company_id=None, outside_duplication=False):
    if not template.id and not type(template) is DocumentTemplate:
        return False

    exclude_fields = ["created_at"]

    # Cannot duplicate workflow if it's duplicating to another company
    if outside_duplication:
        exclude_fields.append("workflow")

    DT_table = DocumentTemplate.__table__
    non_pk_columns = [
        k
        for k in DT_table.columns.keys()
        if k not in DT_table.primary_key.columns.keys() and k not in exclude_fields
    ]
    data = {c: getattr(template, c) for c in non_pk_columns}

    if company_id:
        data["company_id"] = company_id

    data["user_id"] = user_id

    template_name_count = (
        DocumentTemplate.query.filter(
            DocumentTemplate.name.contains(data["name"] + " (Copy) ")
        )
        .filter_by(company_id=data["company_id"])
        .count()
    )
    if template_name_count > 0:
        data["name"] = data["name"] + " (Copy) " + str(template_name_count)
    else:
        data["name"] = data["name"] + " (Copy) "

    try:
        duplicated_template = template.__class__(**data)
        db.session.add(duplicated_template)
        db.session.commit()
    except Exception as e:
        capture_exception(e)
        return False

    if template.text_type == ".docx":
        original_file_key = (
            f'{template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/'
            + "{template.id}/{template.filename}.docx"
        )
        new_file_key = (
            f'{duplicated_template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/'
            + "{duplicated_template.id}/{template.filename}.docx"
        )
    elif template.text_type == ".txt":
        original_file_key = (
            f'{template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/'
            + "{template.id}/{template.id}.txt"
        )
        new_file_key = (
            f'{duplicated_template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/'
            + "{duplicated_template.id}/{duplicated_template.id}.txt"
        )
    else:
        return True

    try:
        s3 = boto3.resource("s3")
        copy_source = {
            "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            "Key": original_file_key,
        }
        s3.meta.client.copy(
            copy_source,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            new_file_key,
        )
    except Exception as e:
        capture_exception(e)

    return True
