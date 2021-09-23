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


def generate_external_token_controller(template_id, title, user_id, max_token_uses):
    generated_token = uuid.uuid4()
    new_token = ExternalToken(
        document_template_id=template_id,
        token=generated_token,
        user_id=user_id,
        title=title,
        max_uses=max_token_uses,
        current_uses=0
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

def mark_token_as_used_controller(token):
    token = ExternalToken.query.filter_by(token=str(token)).first()
    token.current_uses += 1
    if token.current_uses == token.max_uses and token.max_uses != 0:
        token.used = True
    db.session.add(token)
    db.session.commit()
    return