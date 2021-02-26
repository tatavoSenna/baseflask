import uuid

from app import db
from datetime import datetime
from app.models.user import User
from app.models.documents import Document, DocumentTemplate, ExternalToken
from app.documents.controllers import get_current_date_dict
from app.documents.remote import RemoteDocument


def generate_external_token_controller(template_id, user_id):
    generated_token = uuid.uuid4()
    new_token = ExternalToken(
        document_template_id=template_id,
        token=generated_token,
        user_id=user_id
    )
    db.session.add(new_token)
    db.session.commit()
    return generated_token


def authorize_external_token_controller(token):
    token = ExternalToken.query.filter_by(token=str(token)).first()
    if token is None:
        msg = "Unauthorized token"
        template_id = 0
    elif token.used == True:
        msg = "This token has already been used"
        template_id = 0
    else:
        msg = "Token Found"
        template_id = token.document_template_id
    return msg, template_id


def get_template_controller(template_id):
    template = DocumentTemplate.query.filter_by(id=template_id).first()

    return template


def create_external_document_controller(variables, template_id, title, token):
    document_template = DocumentTemplate.query.filter_by(
        id=template_id).first()
    creation_token = ExternalToken.query.filter_by(token=str(token)).first()
    if creation_token == None:
        return 0, ""
    elif creation_token.used == True:
        return -1, ""
    user = User.query.filter_by(id=creation_token.user_id).first()

    current_date_dict = get_current_date_dict()
    variables.update(current_date_dict)
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    version = [{"description": "Version 0",
                "email": user.email,
                "created_at": current_date,
                "id": "0",
                "comments": None
                }]
    document_workflow = document_template.workflow
    document_workflow['created_by'] = "External User"
    document = Document(
        user_id=user.id,
        company_id=user.company_id,
        form=document_template.form,
        workflow=document_workflow,
        signers=document_template.signers,
        variables=variables,
        versions=version,
        created_at=datetime.utcnow().isoformat(),
        title=title,
        document_template_id=template_id,
    )

    remote_document = RemoteDocument()
    remote_document.create(document)
    creation_token.used = True

    db.session.add(document)
    db.session.add(creation_token)
    db.session.commit()

    return 1, document
