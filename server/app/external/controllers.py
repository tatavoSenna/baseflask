import logging
import uuid

from app import db
from datetime import datetime
from app.models.user import User
from app.models.documents import Document, DocumentTemplate, ExternalToken
from app.documents.controllers import get_current_date_dict
from app.documents.remote import RemoteDocument
from app.documents.variables import specify_variables


class ExceptionWithMsg(Exception):
    def __init__(self, msg):
        self.msg = msg

    def __str__(self):
        return repr(self.msg)

class VariableStylingException(Exception):
    def __init__(self, msg):
        self.msg = msg

    def __str__(self):
        return repr(self.msg)


def get_template_controller(template_id):
    template = DocumentTemplate.query.filter_by(id=template_id).first()

    return template


def generate_external_token_controller(template_id, title, user_id):
    generated_token = uuid.uuid4()
    new_token = ExternalToken(
        document_template_id=template_id,
        token=generated_token,
        user_id=user_id,
        title=title
    )
    db.session.add(new_token)
    db.session.commit()
    return generated_token


def authorize_external_token_controller(token):
    token = ExternalToken.query.filter_by(token=str(token)).first()
    if token is None:
        raise ExceptionWithMsg("Unauthorized token")
    elif token.used == True:
        raise ExceptionWithMsg("This token has already been used")
    template_id = token.document_template_id
    return template_id


def create_external_document_controller(variables, token, visible):
    creation_token = ExternalToken.query.filter_by(token=str(token)).first()
    if creation_token == None:
        raise ExceptionWithMsg("Token not found")
    elif creation_token.used == True:
        raise ExceptionWithMsg("This Token has already been used")
    document_template = DocumentTemplate.query.filter_by(
        id=creation_token.document_template_id).first()
    user = User.query.filter_by(id=creation_token.user_id).first()

    try:
        pre_styled_variables = specify_variables(variables, creation_token.document_template_id)
    except Exception as e:
        logging.exception(e)
        raise VariableStylingException('Error trying to transform variables with according to their doc_string_style.')

    current_date_dict = get_current_date_dict()
    pre_styled_variables.update(current_date_dict)
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    version = [{"description": "Version 0",
                "email": user.email,
                "created_at": current_date,
                "id": "0",
                "comments": None
                }]
    document_workflow = document_template.workflow
    document_workflow['created_by'] = "External User"
    form_with_visible = document_template.form
    for page_index, page in enumerate(form_with_visible):
        for field_index, field in enumerate(page['fields']):
            field['visible'] = visible[page_index][field_index]
    document = Document(
        user_id=user.id,
        company_id=user.company_id,
        form=form_with_visible,
        workflow=document_workflow,
        signers=document_template.signers,
        variables=variables,
        versions=version,
        created_at=datetime.utcnow().isoformat(),
        title=creation_token.title,
        document_template_id=creation_token.document_template_id,
        text_type=document_template.text_type,
    )

    creation_token.used = True

    db.session.add(document)
    db.session.add(creation_token)
    db.session.commit()

    remote_document = RemoteDocument()
    remote_document.create(document, document_template, user.company_id, pre_styled_variables)

    return document
