import json
import base64
import io
import boto3
import requests
from datetime import datetime
from datetime import date

from app import db
from app.constants import months
from app.models.documents import Document, DocumentTemplate
from app.models.company import Company, Webhook
from app.models.user import User
from .remote import RemoteDocument
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import copy
from flask import current_app, jsonify
from unittest.mock import MagicMock


def get_document_template_list_controller(company_id):

    document_templates = DocumentTemplate.query.filter_by(
        company_id=company_id).filter_by(published=True).all()
    return document_templates


def get_document_template_details_controller(company_id, template_id):

    document_template = DocumentTemplate.query.filter_by(
        company_id=company_id, id=template_id
    ).first()

    return document_template


def create_document_controller(user_id, user_email, company_id, variables,
                               document_template_id, title, username, received_variables,
                               parent_id, is_folder):

    document_template = DocumentTemplate.query.get(document_template_id)
    document_company = Company.query.filter_by(id=company_id).first()
    user_name = User.query.filter_by(id=user_id).first().name
    current_date_dict = get_current_date_dict()
    variables.update(current_date_dict)
    received_variables.update(current_date_dict)

    nome_contrato = received_variables.get("NOME_CONTRATO", None)
    data_inicio_contrato = received_variables.get("DATA_INICIO_CONTRATO", None)
    data_final_contrato = received_variables.get("DATA_FINAL_CONTRATO", None)
    data_assinatura = received_variables.get("DATA_ASSINATURA", None)
    valor_contrato = received_variables.get("VALOR_CONTRATO", None)

    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    version = [{"description": "Version 0",
                "email": user_email,
                "created_at": current_date,
                "id": "0",
                "comments": None
                }]
    document_workflow = document_template.workflow
    document_workflow['created_by'] = username
    current_node = document_workflow["current_node"]
    step_name = document_workflow["nodes"][current_node]["title"]
    document = Document(
        user_id=user_id,
        company_id=company_id,
        form=document_template.form,
        workflow=document_workflow,
        signers=document_template.signers,
        variables=received_variables,
        versions=version,
        created_at=datetime.utcnow().isoformat(),
        title=title,
        current_step=step_name,
        document_template_id=document_template_id,
        text_type=document_template.text_type,
        nome_contrato=nome_contrato,
        data_inicio_contrato=data_inicio_contrato,
        data_final_contrato=data_final_contrato,
        data_assinatura=data_assinatura,
        valor_contrato=valor_contrato
    )
    db.session.add(document)
    db.session.commit()

    remote_document = RemoteDocument()
    remote_document.create(document, document_template,
                           company_id, variables)
    if company_id == '11':
        sns = boto3.client('sns')
        topic_arn = current_app.config["SNS_NEWDOCUMENT_ARN"]
        message = {"document": title,
                   "company": company_id
                   }

        response = sns.publish(
            TargetArn=topic_arn,
            Message=json.dumps({'default': json.dumps(message)}),
            MessageStructure='json'
        )

    webhook_list = Webhook.query.filter_by(company_id=company_id).all()
    for webhook in webhook_list:
        sns = boto3.client('sns')
        topic_arn = current_app.config["SNS_NEWDOCUMENT_ARN"]
        message = {"document_title": title,
                   "document_id": document.id,
                   "document_template_name": document_template.name,
                   "document_template_id": document_template_id,
                   "company_name": document_company.name,
                   "company_id": company_id,
                   "user_id": user_id,
                   "user_name": user_name,
                   "created_at": json.dumps(document.created_at, indent=4, sort_keys=True, default=str),   
                   "valor_contrato": valor_contrato,
                   "data_inicio_contrato": data_inicio_contrato,
                   "data_final_contrato": data_final_contrato,
                   "data_assinatura": data_assinatura,
                   "nome_contrato": nome_contrato,
                   "webhook_url": webhook.webhook
                   }

        response = sns.publish(
            TargetArn=topic_arn,
            Message=json.dumps({'default': json.dumps(message)}),
            MessageStructure='json'
        )

    return document


def create_folder_controller(user_id, user_email, company_id, title, username, parent_id, is_folder):

    document = Document(
        user_id=user_id,
        company_id=company_id,
        created_at=datetime.utcnow().isoformat(),
        title=title,
        parent_id=parent_id,
        is_folder=is_folder
    )
    db.session.add(document)
    db.session.commit()

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
        document, version_id).decode('utf-8')
    return textfile


def download_document_docx_controller(document_id, version_id):
    document = get_document_controller(document_id)
    remote_document = RemoteDocument()
    docx_io = remote_document.download_docx_from_documents(
        document, version_id)
    return docx_io


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
    document.current_step = document.workflow["nodes"][next_node]["title"]
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
    document.current_step = document.workflow["nodes"][previous_node]["title"]
    db.session.add(document)
    db.session.commit()
    return document, 0


def document_creation_email_controller(title, company_id):
    company_users = User.query.filter_by(company_id=company_id)
    email_list = []
    for user in company_users:
        email_list.append(user.email)
    response = send_email_controller('leon@lawing.com.br', email_list,
                                     "New Document created", title, 'd-83efa7b8d2fb4742a69dd9059324e148')
    return response


def workflow_status_change_email_controller(document_id, name):
    document = get_document_controller(document_id)
    workflow = document.workflow
    node = workflow["current_node"]
    users_IDS = workflow["nodes"][node]["responsible_users"]
    status = workflow["nodes"][node]["title"]
    title = document.title
    email_list = []

    # for each user id, add respective user email to email list
    for user_id in users_IDS:
        if isinstance(user_id, int):
            email = User.query.filter_by(id=user_id).first().email
            if email not in email_list:
                email_list.append(email)
    if len(email_list) == 0:
        return
    response = send_email_controller('leon@lawing.com.br', email_list,
                                     f'O Documento {title} mudou para o status {status}.', name, 'd-d869f27633274db3810abaa3b60f1833')
    return response


def send_email_controller(sender_email, recipient_emails, email_subject, name, template_id):
    message = Mail(
        from_email=sender_email,
        to_emails=recipient_emails)
    # faz as substituições necessárias no template
    if name is not None:
        message.dynamic_template_data = {
            'name': name
        }
    message.template_id = template_id
    sg = SendGridAPIClient(current_app.config["SENDGRID_API_KEY"])
    response = sg.send(message)
    return response


def get_download_url_controller(document):
    remote_document = RemoteDocument()
    url = remote_document.download_signed_document(document)
    return url


def get_pdf_download_url_controller(document, version_id):
    remote_document = RemoteDocument()
    url = remote_document.download_pdf_document(document, version_id)
    return url


def get_docx_download_url_controller(document):
    remote_document = RemoteDocument()
    url = remote_document.download_docx_document(document)
    return url


def fill_signing_date_controller(document, text):
    signing_date = json.dumps(date.today().strftime(
        '%d/%m/%Y'), default=str).replace('"', " ")
    variable = {"CURRENT_DATE": signing_date}
    document.variables["SIGN_DATE"] = signing_date
    db.session.add(document)
    db.session.commit()

    remote_document = RemoteDocument()
    if document.text_type == ".txt":
        filled_text = remote_document.fill_text_with_variables(
            text, variable)
    elif document.text_type == ".docx":
        filled_text = remote_document.fill_docx_with_variables(
            document, text, variable)

    return filled_text


def convert_pdf_controller(text):
    remote_document = RemoteDocument()
    template = remote_document.get_template()
    formatted_text = remote_document.fill_text_with_variables(
        template, {'text_contract': text})
    document_pdf = requests.post(
        current_app.config["HTMLTOPDF_API_URL"], data=formatted_text.encode('utf-8')).content
    return base64.b64decode(document_pdf)


def change_variables_controller(document, new_variables, email, variables):
    document_template = DocumentTemplate.query.filter_by(
        id=document.document_template_id).first()
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    versions = document.versions
    current_version = int(versions[0]["id"])
    new_version = current_version + 1
    version = {"description": "Changed document variables",
               "email": email,
               "created_at": current_date,
               "id": str(new_version),
               "comments": ""}

    # need to make a copy to track changes to JSON, otherwise the changes are not updated
    document.versions = copy.deepcopy(document.versions)
    document.versions.insert(0, version)
    document.variables = variables
    db.session.add(document)
    db.session.commit()
    remote_document = RemoteDocument()
    print(document.company_id)
    remote_document.update_variables(
        document, document_template, document.company_id, new_variables)
