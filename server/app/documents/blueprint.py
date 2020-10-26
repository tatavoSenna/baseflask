import os
import io
import logging
import base64
import json
import uuid

from datetime import datetime

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
from app.constants import months
from app.serializers.document_serializers import DocumentSerializer, DocumentTemplateSerializer, DocumentTemplateListSerializer
from app.models.documents import Document, DocumentTemplate
from app.users.remote import get_local_user
from app.docusign.serializers import EnvelopeSerializer
from app.docusign.services import get_token

from .controllers  import (
    get_document_template_list_controller,
    get_document_template_details_controller,
    create_document,
    get_document_controller
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
            "items": DocumentSerializer(many=True).dump(paginated_query.items),
        }
    )


@documents_bp.route("/create", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create(current_user):
    # check if content_type is json
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    # check for required parameters
    content = request.json
    document_template_id = content.get("model", None)
    variables = content.get("variables", None)

    if not document_template_id or not variables:
        error_msg = "Value is missing. Needs questions and document model id"
        return jsonify({"message": error_msg}), 400

    # loads the document model
    document_template = DocumentTemplate.query.get(document_template_id)
    if not document_template:
        error_msg = "Document model is missing."
        return jsonify({"message": error_msg}), 404

    unique_id = uuid.uuid1()
    title = f"{document_template.name}-{unique_id}"

    now = datetime.now()
    variables["day"] = str(now.day).zfill(2)
    variables["month"] = months[now.month - 1]
    variables["year"] = now.year
    variables[
        "today"
    ] = f'{ variables["day"] }/{ variables["month"] }/{ variables["year"] }'

    if document_template.filetype == "docx":
        # generate document from docx_template
        doc = DocxTemplate(
            f"app/documents/template/{document_template_id}.docx")
        doc.render(variables)
        document_buffer = io.BytesIO()
        doc.save(document_buffer)
    elif document_template.filetype == "pdf":
        # generate document from pdf
        pdf_template = pdfrw.PdfReader(
            f"app/documents/template/{document_template_id}.pdf"
        )
        for page in pdf_template.Root.Pages.Kids:
            if page.Annots:
                for field in page.Annots:
                    if field.get("/T", [])[1:-1] in context.keys():
                        kwargs = {"V": context[field["/T"][1:-1]]}
                        field.update(pdfrw.PdfDict(**kwargs))

        pdf_template.Root.AcroForm.update(
            pdfrw.PdfDict(NeedAppearances=pdfrw.PdfObject("true"))
        )

        temp_file_name = f"{unique_id}_temp.pdf"
        pdfrw.PdfWriter().write(temp_file_name, pdf_template)
        document_buffer = open(temp_file_name, "rb")
        document_buffer.read()
        os.remove(temp_file_name)

    document = create_document(
        current_user["company_id"],
        current_user["id"],
        title,
        document_template_id,
    )

    # save generated document to an s3
    # s3_client = boto3.client("s3")
    # remote_filename = f"{document.id}/{'version.version_number'}_{int(datetime.now().timestamp())}.{document_template.filetype}"
    # document_buffer.seek(0)

    # try:
    #     s3_client.upload_fileobj(
    #         document_buffer,
    #         current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
    #         f'{current_app.config["AWS_S3_DOCUMENT_ROOT"]}/{remote_filename}',
    #     )
    # except ClientError as e:
    #     print(f"error uploading to s3 {e}")

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
