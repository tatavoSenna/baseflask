import logging
import json
from app.documents.controllers import create_document_controller

import boto3

from flask import request, Blueprint, abort, jsonify

from app import aws_auth
from app.serializers.document_serializers import (
    DocumentTemplateSerializer,
    DocumentSerializer
)
from app.users.remote import get_local_user

from .controllers import (
    generate_external_token_controller,
    authorize_external_token_controller,
    get_template_controller,
    ExceptionWithMsg,
    mark_token_as_used_controller
)
from app.models.documents import DocumentTemplate, ExternalToken
from app.models.user import User
from app import db

external_bp = Blueprint("external", __name__)


@external_bp.route("/token", methods=["POST"])
@ aws_auth.authentication_required
@ get_local_user
def generate_token(current_user):
    content = request.json
    template_id = content.get("document_template", None)
    title = content.get("title", None)
    max_token_uses = content.get("max_uses", None)
    if max_token_uses == None:
        max_token_uses = 1
    if title is None:
        abort(400, "Document must have a title")
    try:
        token = generate_external_token_controller(
            template_id, title, current_user["id"], max_token_uses)
        token_JSON = {"token": token}
    except Exception as e:
        logging.exception(
            "Could not generate external token")
        abort(400, "Could not generate external token")
    return jsonify(token_JSON)


@external_bp.route("/authorize", methods=["POST"])
def authorize_token():
    content = request.json
    token = content.get("token", None)
    if token is None:
        return jsonify({"Authorized": False,
                        "Message": "Token is missing"}), 200
    try:
        template_id = authorize_external_token_controller(token)
    except ExceptionWithMsg as e:
        return jsonify({"Authorized": False,
                        "Message": e.msg}), 200
    document_template = get_template_controller(template_id)
    if document_template is None:
        return jsonify({"Authorized": False,
                        "Message": "Document Template not found in database"}), 200
    return jsonify({"Authorized": True,
                    "Message": "Document was created",
                    "Template": DocumentTemplateSerializer(many=False).dump(document_template)}), 200


@external_bp.route("/create", methods=["POST"])
def create_document_from_token():
    content = request.json
    variables = content.get("variables", None)
    token = content.get("token", None)
    parent = content.get("parent",None)
    is_folder = content.get("is_folder",False)
    if not variables or not token:
        abort(400, "Need to provide variables and template id")
    
    # Check if creation token exists and if it has not been used yet
    creation_token = ExternalToken.query.filter_by(token=str(token)).first()
    if creation_token == None:
        raise ExceptionWithMsg("Token not found")
    elif creation_token.used == True:
        raise ExceptionWithMsg("This Token has already been used")



    try:
        # Get user parameters and template parameters using the external token and create document
        user = User.query.filter_by(id=creation_token.user_id).first()
        document = create_document_controller(
            user.id,
            user.email,
            user.company_id,
            creation_token.document_template_id,
            creation_token.title,
            user.name,
            variables,
            parent,
            is_folder
        )
        # Marks token as used
        mark_token_as_used_controller(creation_token.token)
    except ExceptionWithMsg as e:
        logging.exception(
            "Could not create document")
        abort(400, e.msg)
    except Exception as e:
        logging.exception(
            "Could not create document")
        abort(400, "Could not create document")
    return jsonify(DocumentSerializer(many=False).dump(document))
