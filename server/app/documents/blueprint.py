import os
import io
import logging
import base64
import json

import boto3
import pdfrw

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

from app import db, aws_auth
from app.serializers.document_serializers import (
    DocumentSerializer,
    DocumentTemplateSerializer,
    DocumentTemplateListSerializer,
    DocumentListSerializer
)
from app.models.documents import Document, DocumentTemplate
from app.users.remote import get_local_user
from app.docusign.serializers import EnvelopeSerializer
from app.docusign.services import get_token

from .controllers  import (
    get_document_template_list_controller,
    get_document_template_details_controller,
    edit_signers_controller,
    create_document_controller,
    create_new_version_controller,
    get_document_controller,
    get_document_version_controller,
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
    try:
        #get current version
        version_id = get_document_version_controller(document_id)
    except Exception:
        abort(404, "Document not Found")
    s3_resource = boto3.resource('s3')
    filename = f"documents/{document_id}/{version_id}.txt"
    obj = s3_resource.Object('lawing-documents-dev', filename)
    data = io.BytesIO()
    obj.download_fileobj(data)
    return jsonify(
        {
            "text": obj.get()['Body'].read().decode('utf-8')
        }
    )

@documents_bp.route("/<int:document_id>/text", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def add_document_text(current_user, document_id):
    #get current version
    try:
       version_id = create_new_version_controller(document_id)
    except Exception:
        abort(404, "Document not Found")

    if not request.is_json:
        return jsonify({"message": "Accepts only text in content-type json."}), 400
    content = request.json
    #get text content to upload and create s3 filepath
    document_text = content.get("text", None)
    filename = f"documents/{document_id}/{version_id}.txt"

    s3_resource = boto3.resource('s3')
    object = s3_resource.Object('lawing-documents-dev',filename)
    #save new version on s3 as binary
    try:
        object.put(Body=bytearray(document_text,encoding='utf8'))
    except ClientError as e:
        print(f"error uploading to s3 {e}")

    return jsonify(
        {
            "text":document_text
        }
    )

@documents_bp.route("", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create(current_user):
    # check if content_type is json
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    document_template_id = content.get("document_template", None)
    variables = content.get("variables", None)

    if not document_template_id or not variables:
        error_msg = "Value is missing. Needs questions and document model id"
        return jsonify({"message": error_msg}), 400

    document = create_document_controller(
        current_user["company_id"],
        current_user["id"],
        variables,
        document_template_id,
    )

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

    s3_client = boto3.client("s3")
    document_url = s3_client.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            "Key": f'{current_app.config["AWS_S3_DOCUMENT_ROOT"]}/{document.versions[0].filename}'
        },
        ExpiresIn=180,
    )

    response = {
        "download_url": document_url,
        "document_name": f"{document.versions[0].filename}.{document.template.filetype}",
    }

    return jsonify(response)


@documents_bp.route("/templates", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def documents(current_user):

    document_templates = get_document_template_list_controller(current_user["company_id"])

    return jsonify({"DocumentTemplates": DocumentTemplateListSerializer(many=True).dump(document_templates)})


@documents_bp.route("/templates/<int:documentTemplate_id>", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def document(current_user, documentTemplate_id): 

    document_template = get_document_template_details_controller(current_user["company_id"], documentTemplate_id)

    return jsonify({"DocumentTemplate": DocumentTemplateSerializer().dump(document_template)})


@documents_bp.route("/<int:document_id>/signers", methods=["PATCH"])
@aws_auth.authentication_required
@get_local_user
def edit_signers(current_user, document_id): 
    content = request.json
    if content:
        signers = content.get('signers')
    else:
        abort(400, 'no content')
    if not signers:
        abort(400, "signers field is required")

    document = edit_signers_controller(document_id, content['signers'])

    return jsonify(DocumentSerializer(many=False).dump(document))
