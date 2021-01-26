import os
import io
import logging
import base64
import json

import boto3
import pdfrw
import ast

from flask import request, Blueprint, abort, jsonify, current_app
from botocore.exceptions import ClientError
from docusign_esign import (
    ApiClient,
    EnvelopesApi,
    EnvelopeDefinition,
    Signer,
    SignHere,
    Tabs,
    Recipients,
    Document as DocusignDocument,
)
from docxtpl import DocxTemplate
from slugify import slugify
from sqlalchemy import desc
import logging


from app import db, aws_auth
from app.serializers.document_serializers import (
    DocumentSerializer,
    DocumentTemplateSerializer,
    DocumentTemplateListSerializer,
    DocumentListSerializer
)
from app.models.documents import Document, DocumentTemplate
from app.models.company import Company
from app.users.remote import get_local_user
from app.docusign.serializers import EnvelopeSerializer
from app.docusign.services import get_token

from .controllers import (
    get_document_template_list_controller,
    get_document_template_details_controller,
    save_signers_controller,
    create_document_controller,
    create_new_version_controller,
    get_document_controller,
    get_document_version_controller,
    get_comments_version_controller,
    download_document_text_controller,
    upload_document_text_controller,
    next_status_controller,
    previous_status_controller,
    document_creation_email_controller,
    workflow_status_change_email_controller,
    get_download_url_controller
)
from app.docusign.controllers import (
    sign_document_controller
)

documents_bp = Blueprint("documents", __name__)


@documents_bp.route("/<int:document_id>")
@aws_auth.authentication_required
@get_local_user
def get_document_detail(current_user, document_id):
    try:
        document = get_document_controller(document_id)
        if not document:
            abort(404, "Document not Found")
    except Exception:
        abort(404, "Document not Found")
    return jsonify(DocumentSerializer(many=False).dump(document))


@documents_bp.route("/")
@aws_auth.authentication_required
@get_local_user
def get_document_list(current_user):
    try:
        page = int(request.args.get(
            "page", current_app.config['PAGE_DEFAULT']))
        per_page = int(request.args.get(
            "per_page", current_app.config['PER_PAGE_DEFAULT']))
        search_param = str(request.args.get("search", ""))
    except:
        abort(400, "invalid parameters")

    paginated_query = (
        Document.query.filter_by(company_id=current_user["company_id"])
        .filter(Document.title.ilike(f"%{search_param}%"))
        .order_by(desc(Document.created_at))
        .paginate(page=page, per_page=per_page)
    )

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "items": DocumentListSerializer(many=True).dump(paginated_query.items),
        }
    )


@documents_bp.route("/<int:document_id>/text", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_document_text(current_user, document_id):
    version_id = request.args.get('version')
    comments = get_comments_version_controller(document_id)
    if not version_id:
        version_id = get_document_version_controller(document_id)
    try:
        textfile = download_document_text_controller(document_id, version_id)
    except Exception:
        abort(404, "Document not Found")
    return jsonify(
        {
            "text": textfile.decode('utf-8'),
            "version_id": version_id,
            "comments": comments
        }
    )


@documents_bp.route("/<int:document_id>/text", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def add_document_text(current_user, document_id):
    if not request.is_json:
        return jsonify({"message": "Accepts only text in content-type json."}), 400
    content = request.json
    document_text = content.get("text", None)
    description = content.get("description", None)
    comments = content.get("comments", None)
    try:
        # create new version in 'versions' array before uploading the text
        create_new_version_controller(
            document_id, description, current_user["email"], comments)
    except Exception:
        abort(404, "Document not Found")

    try:
        upload_document_text_controller(document_id, document_text)
        document = get_document_controller(document_id)
    except Exception:
        abort(404, "Error uploading to s3")

    return jsonify(
        {
            "uploaded_text": document_text,
            "updated_versions_list": document.versions
        }
    )


@documents_bp.route("/", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create(current_user):
    # check if content_type is json
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    document_template_id = content.get("document_template", None)
    variables = content.get("variables", None)
    title = content.get("title", None)

    if not document_template_id or not variables:
        error_msg = "Value is missing. Needs questions and document model id"
        return jsonify({"message": error_msg}), 400
    document = create_document_controller(
        current_user["id"],
        current_user["email"],
        current_user["company_id"],
        variables,
        document_template_id,
        title,
        current_user["name"]
    )
    try:
        response = document_creation_email_controller(
            title, current_user["company_id"], current_user["email"])
    except Exception as e:
        logging.exception(
            "Failed to send emails on document creation. One or more emails is bad formated or invalid")
    return DocumentSerializer().dump(document)


@documents_bp.route("/<int:document_id>/download")
@aws_auth.authentication_required
@get_local_user
def download(current_user, document_id):
    if not document_id:
        abort(400, "Missing document id")

    try:
        document = Document.query.get(document_id)
    except Exception:
        abort(404, "Document not Found")
    if document.signed != True:
        abort(
            403, "Document has not finished signing yet, so it's not available for download")

    try:
        document_url = get_download_url_controller(document)
    except:
        abort(
            400, "Could not download document from S3")

    response = {
        "download_url": document_url,
        "document_name": f"{document.title}.pdf",
    }

    return jsonify(response)


@documents_bp.route("/<int:document_id>/next")
@aws_auth.authentication_required
@get_local_user
def next_document_status(current_user, document_id):
    try:
        document, status = next_status_controller(
            document_id, current_user["name"])
        if not document:
            abort(404, "Document not Found")
        if status == 1:
            abort(400, "There is no next status")
    except Exception:
        abort(404, "Could not change document status")
    try:
        response = workflow_status_change_email_controller(
            document_id, current_user["email"])
    except Exception:
        logging.exception(
            "Could not send email after changing workflow status")

    return DocumentSerializer().dump(document)


@documents_bp.route("/<int:document_id>/previous")
@aws_auth.authentication_required
@get_local_user
def previous_document_status(current_user, document_id):
    try:
        document, status = previous_status_controller(document_id)
        if not document:
            abort(404, "Document not Found")
        if status == 1:
            abort(404, "There is no previous status")
    except Exception:
        abort(404, "Could not change document status")
    try:
        response = workflow_status_change_email_controller(
            document_id, current_user["email"])
    except Exception:
        logging.exception(
            "Could not send email after changing workflow status")

    return DocumentSerializer().dump(document)


@documents_bp.route("/templates", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def documents(current_user):

    document_templates = get_document_template_list_controller(
        current_user["company_id"])

    return jsonify({"DocumentTemplates": DocumentTemplateListSerializer(many=True).dump(document_templates)})


@documents_bp.route("/templates/<int:documentTemplate_id>", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def document(current_user, documentTemplate_id):
    document_template = get_document_template_details_controller(
        current_user["company_id"], documentTemplate_id)

    return jsonify({"DocumentTemplate": DocumentTemplateSerializer().dump(document_template)})


@documents_bp.route('/sign', methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def request_signatures(current_user):
    content = request.json
    document_id = content.get("document_id", None)
    if not document_id:
        abort(400, 'Missing document id')

    try:
        version_id = get_document_version_controller(document_id)
        textfile = download_document_text_controller(document_id, version_id)
        current_document = get_document_controller(document_id)
    except Exception:
        abort(404, {"message": "Document not found"})

    if current_document.sent == True:
        abort(
            400, {"message": "Signature already requested for this document"})

    company = Company.query.get(current_user.get("company_id"))
    account_ID = company.docusign_account_id
    if account_ID == None:
        abort(
            400, {"message": "User has no Docusign Account ID registered"})
    token = get_token(current_user)
    if token is None:
        abort(400, {"message": "Missing DocuSign user token"})
    try:
        sign_document_controller(
            current_document, textfile, account_ID, token, current_user["name"])
    except Exception as e:
        dict_str = e.body.decode("utf-8")
        ans_json = ast.literal_eval(dict_str)
        if ans_json['errorCode'] == 'ANCHOR_TAB_STRING_NOT_FOUND':
            error_JSON = {
                "message": "Missing Anchor String on Document text"
            }

        elif ans_json['errorCode'] == 'AUTHORIZATION_INVALID_TOKEN':
            error_JSON = {
                "message": "Token is expired or invalid"
            }

        elif ans_json['errorCode'] == 'USER_AUTHENTICATION_FAILED':
            error_JSON = {
                "message": "Invalid Docusign access token. User authentication failed"
            }

        else:
            error_JSON = {
                "message": "Something went wrong when trying to sign document, please check signers information"
            }

        return jsonify(error_JSON), 400

    return jsonify(DocumentSerializer().dump(current_document))


@ documents_bp.route("/<int:document_id>/signers", methods=["POST"])
@ aws_auth.authentication_required
@ get_local_user
def save_signers(current_user, document_id):
    content = request.json
    if content:
        try:
            document = save_signers_controller(document_id, content)
        except Exception as e:
            print(e)
            abort(404, "Could not save document signers")
    else:
        abort(400, 'no content')

    return jsonify(DocumentSerializer(many=False).dump(document))
