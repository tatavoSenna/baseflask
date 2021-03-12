import json
from datetime import datetime
from datetime import date

from app import db
from app.constants import months
from app.models.documents import Document, DocumentTemplate
from app.models.user import User, ParticipatesOn
from .remote import RemoteDocument
from app.serializers.document_serializers import (
    DocumentSerializer
)
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import copy
from flask import current_app
from unittest.mock import MagicMock


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


def create_document_controller(user_id, user_email, company_id, variables, document_template_id, title, username):
    document_template = DocumentTemplate.query.get(document_template_id)

    current_date_dict = get_current_date_dict()
    variables.update(current_date_dict)
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    version = [{"description": "Version 0",
                "email": user_email,
                "created_at": current_date,
                "id": "0",
                "comments": None
                }]
    document_workflow = document_template.workflow
    document_workflow['created_by'] = username
    document = Document(
        user_id=user_id,
        company_id=company_id,
        form=document_template.form,
        workflow=document_workflow,
        signers=document_template.signers,
        variables=variables,
        versions=version,
        created_at=datetime.utcnow().isoformat(),
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


def delete_document_controller(document):
    remote_document = RemoteDocument()
    remote_document.delete_document(document)
    if document.signed:
        remote_document.delete_signed_document(document)
    if not isinstance(document, MagicMock):
        db.session.delete(document)
        db.session.commit()


def get_document_version_controller(document_id):
    document = get_document_controller(document_id)
    # take size of array with will be version + 1
    current_version = document.versions[0]["id"]
    return current_version


def get_comments_version_controller(document_id):
    document = get_document_controller(document_id)
    current_comments = document.versions[0]["comments"]
    return current_comments


def save_signers_controller(document_id, signers_variables):
    document = get_document_controller(document_id)
    # need to make a copy so that the 'signers' and 'variables' JSON changes are tracked
    variables = copy.deepcopy(document.variables)
    variables.update(signers_variables)
    document.variables = variables
    db.session.add(document)
    db.session.commit()

    return document


def create_new_version_controller(document_id, description, user_email, comments):
    document = Document.query.filter_by(id=document_id).first()
    versions = document.versions
    current_version = int(versions[0]["id"])
    new_version = current_version + 1
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    version = {"description": description,
               "email": user_email,
               "created_at": current_date,
               "id": str(new_version),
               "comments": comments}

    # need to make a copy to track changes to JSON, otherwise the changes are not updated
    document.versions = copy.deepcopy(document.versions)
    document.versions.insert(0, version)
    db.session.add(document)
    db.session.commit()


def download_document_text_controller(document_id, version_id):
    document = get_document_controller(document_id)
    remote_document = RemoteDocument()
    textfile = remote_document.download_text_from_documents(
        document, version_id)
    return textfile


def upload_document_text_controller(document_id, document_text):
    document = get_document_controller(document_id)
    # convert from string to bytes object
    document_text = bytearray(document_text, encoding='utf8')
    remote_document = RemoteDocument()
    remote_document.upload_filled_text_to_documents(document, document_text)


def next_status_controller(document_id, username):
    document = get_document_controller(document_id)
    workflow = document.workflow
    next_node = workflow["nodes"][workflow["current_node"]]["next_node"]
    # check if there is a next node
    if next_node is None:
        return document, 1

    # need to make a copy to track changes to JSON, otherwise the changes are not updated
    document.workflow = copy.deepcopy(document.workflow)
    document.workflow["nodes"][workflow["current_node"]
                               ]["changed_by"] = username
    document.workflow["current_node"] = next_node
    db.session.add(document)
    db.session.commit()
    return document, 0


def previous_status_controller(document_id):
    document = get_document_controller(document_id)
    workflow = document.workflow
    current_node = workflow["current_node"]
    previous_node = None
    nodes = workflow["nodes"].items()
    for key, value in nodes:
        if value["next_node"] == current_node:
            previous_node = key

    # check if there is a previous node
    if previous_node is None:
        return document, 1

    # need to make a copy to track changes to JSON, otherwise the changes are not updated
    document.workflow = copy.deepcopy(document.workflow)
    document.workflow["current_node"] = previous_node
    db.session.add(document)
    db.session.commit()
    return document, 0


def document_creation_email_controller(title, company_id, sender_email):
    company_users = User.query.filter_by(company_id=company_id)
    email_list = []
    for user in company_users:
        email_list.append(user.email)
    response = send_email_controller(sender_email, email_list,
                                     "New Document created", title, 'd-50d8e7117d4640689d8bf638094f2037')
    return response


def workflow_status_change_email_controller(document_id, sender_email):
    document = get_document_controller(document_id)
    workflow = document.workflow
    node = workflow["current_node"]
    group = workflow["nodes"][node]["responsible_group"]
    status = workflow["nodes"][node]["title"]
    title = document.title
    if group == "":
        return
    email_list = []
    # get all user ids for the responsible group
    users = ParticipatesOn.query.filter_by(group_id=group)
    # for each user id, add respective user email to email list
    for user in users:
        email = User.query.filter_by(id=user.user_id).first().email
        if email not in email_list:
            email_list.append(email)
    response = send_email_controller(sender_email, email_list,
                                     f'O Documento {title} mudou para o status {status}.', title, 'd-6b9591b72dc24aaeaac8a871e55660f4')
    return response


def send_email_controller(sender_email, recipient_emails, email_subject, variable, template_id):
    message = Mail(
        from_email=sender_email,
        to_emails=recipient_emails)
    # faz as substituições necessárias no template
    message.dynamic_template_data = {
        'subject': email_subject,
        'variable': variable
    }
    message.template_id = template_id
    sg = SendGridAPIClient(current_app.config["SENDGRID_API_KEY"])
    response = sg.send(message)
    return response


def get_download_url_controller(document):
    remote_document = RemoteDocument()
    url = remote_document.download_signed_document(document)
    return url


def fill_signing_date_controller(document, text):
    signing_date = json.dumps(date.today().strftime(
        '%d/%m/%Y'), default=str).replace('"', " ")
    variable = {"CURRENT_DATE": signing_date}
    remote_document = RemoteDocument()
    filled_text = remote_document.fill_text_with_variables(
        text, variable)
    document.variables["SIGN_DATE"] = signing_date
    db.session.add(document)
    db.session.commit()
    return filled_text
