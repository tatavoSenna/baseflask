import logging
import json

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
    create_external_document_controller
)

external_bp = Blueprint("external", __name__)


@external_bp.route("/token", methods=["POST"])
@ aws_auth.authentication_required
@ get_local_user
def generate_token(current_user):
    content = request.json
    template_id = content.get("document_template", None)
    title = content.get("title", None)
    if title is None:
        abort(400, "Document must have a title")
    try:
        token = generate_external_token_controller(
            template_id, title, current_user["id"])
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
        abort(404, "A Token must be provided")
    response, template_id = authorize_external_token_controller(token)
    if template_id == 0:
        abort(400, response)
    else:
        document_template = get_template_controller(template_id)
        if document_template is None:
            abort(404, "Document template not found")
        return jsonify(DocumentTemplateSerializer(many=False).dump(document_template))


@external_bp.route("/create", methods=["POST"])
def create_document_from_token():
    content = request.json
    document_template_id = content.get("document_template", None)
    variables = content.get("variables", None)
    token = content.get("token", None)

    if not document_template_id or not variables:
        error_msg = "Value is missing. Needs variables and template id"
        return jsonify({"message": error_msg}), 400
    try:
        status, document = create_external_document_controller(
            variables,
            document_template_id,
            token
        )
    except Exception as e:
        logging.exception(
            "Could not create document")
        return jsonify({"Authorized": False}), 200
    if status == 0:
        abort(400, "Token not found")
    elif status == -1:
        abort(400, "This Token has already been used")
    return jsonify({"Authorized": True}), 200
