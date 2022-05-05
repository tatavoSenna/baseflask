from datetime import datetime
import os
import io
import logging
import base64
import json
import jinja2
import copy

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
from sqlalchemy import desc, asc


from app import db, aws_auth
from app.serializers.document_serializers import (
    DocumentSerializer,
    DocumentTemplateSerializer,
    DocumentTemplateListSerializer,
    DocumentListSerializer,
)
from app.models.documents import Document, DocumentTemplate
from app.models.company import Company
from app.users.remote import get_local_user, authenticated_user
from app.docusign.serializers import EnvelopeSerializer
from app.docusign.services import get_token
from app.models.user import User

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
    download_document_docx_controller,
    upload_document_text_controller,
    next_status_controller,
    previous_status_controller,
    document_creation_email_controller,
    workflow_status_change_email_controller,
    get_download_url_controller,
    fill_signing_date_controller,
    delete_document_controller,
    get_pdf_download_url_controller,
    convert_pdf_controller,
    get_docx_download_url_controller,
    change_variables_controller,
    create_folder_controller,
    edit_document_workflow_controller,
)

from app.d4sign.controllers import (
    d4sign_generate_document_certificate_file_presigned_url_controller,
)
from app.docusign.controllers import sign_document_controller, void_envelope_controller

from app.documents.formatters.variables_formatter import (
    format_variables,
    create_text_variable,
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
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_term = str(request.args.get("search", ""))

        folder_id = request.args.get("folder", None)
        folder_id = int(folder_id) if folder_id else None

        type = request.args.get("type", None)

        order_by = str(request.args.get("order_by", "creation_date"))
        order = str(request.args.get("order", "descend"))
    except:
        abort(400, "invalid parameters")

    paginated_query = Document.query.filter_by(
        company_id=current_user["company_id"], parent_id=folder_id
    )

    if type:
        files_or_folders = type == "folder"
        paginated_query = paginated_query.filter_by(is_folder=files_or_folders)

    if search_term:
        paginated_query = paginated_query.filter(
            Document.title.ilike(f"%{search_term}%")
        )

    if order_by:
        order_by_dict = {
            "title": Document.title,
            "due_date": Document.due_date,
            "status": Document.current_step,
            "template": DocumentTemplate.name,
            "creation_date": Document.created_at,
            "username": User.name,
        }
        order_dict = {
            "ascend": asc(order_by_dict[order_by]),
            "descend": desc(order_by_dict[order_by]),
        }

        if order_by == "template":
            paginated_query = paginated_query.outerjoin(Document.template)

        if order_by == "username":
            paginated_query = paginated_query.join(Document.user)

        paginated_query = paginated_query.order_by(
            desc(Document.is_folder), order_dict[order]
        )
    else:
        paginated_query = paginated_query.order_by(desc(Document.is_folder))

    paginated_query = paginated_query.paginate(page=page, per_page=per_page)

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "items": DocumentListSerializer(many=True).dump(paginated_query.items),
        }
    )


@documents_bp.route("/move", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def change_folder(current_user):
    content = request.json
    document_id = content.get("document_id", None)
    destination_id = content.get("destination_id", None)

    document = Document.query.filter_by(id=document_id).first()

    folder_already_exists = Document.query.filter_by(
        parent_id=destination_id, title=document.title
    ).all()
    if folder_already_exists:
        abort(
            400,
            description=f"Já existe um documento ou pasta com este nome na pasta de destino.",
        )

    document.parent_id = destination_id
    db.session.commit()

    return jsonify({"moved_document": document_id, "new_folder": destination_id})


@documents_bp.route("/<int:document_id>/text", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_document_text(current_user, document_id):
    version_id = request.args.get("version")
    comments = get_comments_version_controller(document_id)
    if not version_id:
        version_id = get_document_version_controller(document_id)
    try:
        textfile = download_document_text_controller(document_id, version_id)
    except Exception:
        abort(404, "Document not Found")
    return jsonify({"text": textfile, "version_id": version_id, "comments": comments})


@documents_bp.route("/<int:document_id>/pdf", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_document_pdf(current_user, document_id):
    version_id = request.args.get("version", None)
    if not document_id:
        abort(400, "Missing document id")
    if not version_id:
        version_id = get_document_version_controller(document_id)

    document = get_document_controller(document_id)
    if not document:
        abort(404, "Document not Found")

    try:
        pdf_url = get_pdf_download_url_controller(document, version_id)
    except:
        abort(400, "Could not download document pdf from S3")

    response = {"download_url": pdf_url}
    return jsonify(response)


@documents_bp.route("/<int:document_id>/docx", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_document_docx(current_user, document_id):
    if not document_id:
        abort(400, "Missing document id")
    try:
        document = Document.query.get(document_id)
    except Exception:
        abort(404, "Document not Found")

    try:
        docx_url = get_docx_download_url_controller(document)
    except:
        abort(400, "Could not download document docx from S3")

    response = {"download_url": docx_url}
    return jsonify(response)


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
            document_id, description, current_user["email"], comments
        )
    except Exception:
        abort(404, "Document not Found")

    try:
        upload_document_text_controller(document_id, document_text)
        document = get_document_controller(document_id)
    except Exception:
        abort(404, "Error uploading to s3")

    return jsonify(
        {"uploaded_text": document_text, "updated_versions_list": document.versions}
    )


@documents_bp.route("/", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create(current_user):
    # Check if content_type is json
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    document_template_id = content.get("document_template", None)
    variables = content.get("variables", None)

    title = content.get("title", None)
    parent = content.get("parent", None)
    is_folder = content.get("is_folder", None)

    # Check if content being created is a folder
    if is_folder:

        folder = Document.query.filter_by(
            parent_id=parent, title=title, company_id=current_user["company_id"]
        ).all()

        if folder:
            abort(400, description="Titulo da pasta já existe nesse diretório.")

        document = create_folder_controller(
            current_user["id"],
            current_user["email"],
            current_user["company_id"],
            title,
            current_user["name"],
            parent,
            is_folder,
        )
    else:
        # Check if document template and variables are being communicated
        if not document_template_id or not variables:
            error_msg = "Value is missing. Needs questions and document model id"
            return jsonify({"message": error_msg}), 400

        # Try to create document
        try:
            document = create_document_controller(
                current_user["id"],
                current_user["email"],
                current_user["company_id"],
                document_template_id,
                title,
                current_user["name"],
                variables,
                parent,
                is_folder,
            )
        # Logs errors if user is admin
        except jinja2.TemplateSyntaxError as e:
            logging.exception(e)
            if current_user["is_admin"] == True:
                error_JSON = {
                    "error": "There is a problem with template syntax",
                    "message": e.message,
                }
                return jsonify(error_JSON), 500
            else:
                error_JSON = {"error": "There is a problem with template syntax"}
                return jsonify(error_JSON), 500
        except Exception as e:
            logging.exception("Could not create document")
            error_JSON = {"Message": "Could not create document"}
            if current_user["is_admin"] == True:
                error_JSON["Exception"] = str(e)
            return jsonify(error_JSON), 400

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
            403,
            "Document has not finished signing yet, so it's not available for download",
        )

    try:
        document_url = get_download_url_controller(document)
    except:
        abort(400, "Could not download document from S3")

    response = {"download_url": document_url}

    return jsonify(response)


@documents_bp.route("/<int:document_id>/next")
@aws_auth.authentication_required
@get_local_user
def next_document_status(current_user, document_id):
    try:
        if current_user["name"] == None:
            user = current_user["email"]
        else:
            user = current_user["name"]
        document, status = next_status_controller(document_id, user)
        if not document:
            abort(404, "Document not Found")
        if status == 1:
            abort(400, "There is no next status")
    except Exception:
        logging.exception("Could not change document status")
        abort(404, "Could not change document status")
    try:
        response = workflow_status_change_email_controller(document_id, user)
    except Exception:
        logging.exception("Could not send email after changing workflow status")

    return DocumentSerializer().dump(document)


@documents_bp.route("/<int:document_id>/previous")
@aws_auth.authentication_required
@get_local_user
def previous_document_status(current_user, document_id):
    try:
        if current_user["name"] == None:
            user = current_user["email"]
        else:
            user = current_user["name"]
        document, status = previous_status_controller(document_id)
        if not document:
            abort(404, "Document not Found")
        if status == 1:
            abort(404, "There is no previous status")
    except Exception:
        logging.exception("Could not change document status")
        abort(404, "Could not change document status")
    try:
        response = workflow_status_change_email_controller(document_id, user)
    except Exception:
        logging.exception("Could not send email after changing workflow status")

    return DocumentSerializer().dump(document)


@documents_bp.route("/templates", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def documents(current_user):

    document_templates = get_document_template_list_controller(
        current_user["company_id"]
    )

    return jsonify(
        {
            "DocumentTemplates": DocumentTemplateListSerializer(many=True).dump(
                document_templates
            )
        }
    )


@documents_bp.route("/templates/<int:documentTemplate_id>", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def document(current_user, documentTemplate_id):
    document_template = get_document_template_details_controller(
        current_user["company_id"], documentTemplate_id
    )

    return jsonify(DocumentTemplateSerializer().dump(document_template))


@documents_bp.route("/sign", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def request_signatures(current_user):
    content = request.json
    document_id = content.get("document_id", None)
    if not document_id:
        abort(400, "Missing document id")

    try:
        current_document = get_document_controller(document_id)
        version_id = get_document_version_controller(document_id)
        document_type = current_document.text_type

        if document_type == ".txt":
            textfile = download_document_text_controller(document_id, version_id)
        elif document_type == ".docx":
            docx_io = download_document_docx_controller(document_id, version_id)
        else:
            abort(400, "Document has no type defined in database")
    except Exception:
        logging.exception("Could not get document text")
        abort(404, "Could not get document text")

    if current_document.sent == True:
        abort(400, {"message": "Signature already requested for this document"})

    try:
        if document_type == ".txt":
            textfile = fill_signing_date_controller(current_document, textfile)
        elif document_type == ".docx":
            docx_io = fill_signing_date_controller(current_document, docx_io)
    except:
        logging.exception(
            "Could not fill Current Date variable. Please add variable to document before signing"
        )
    if document_type == ".txt":
        try:
            pdf_document = convert_pdf_controller(textfile)
        except Exception as e:
            logging.exception("Could not convert to pdf and save it on s3")
            abort(404, "Could not convert document to pdf")

    company = Company.query.get(current_user.get("company_id"))
    account_ID = company.docusign_account_id
    if account_ID == None:
        error_JSON = {"message": "User has no Docusign Account ID registered"}
        return jsonify(error_JSON), 400
    token = get_token(current_user)
    if token is None:
        error_JSON = {"message": "Missing DocuSign user token"}
        return jsonify(error_JSON), 400
    try:
        if document_type == ".txt":
            sign_document_controller(
                current_document, pdf_document, account_ID, token, current_user["name"]
            )
        elif document_type == ".docx":
            sign_document_controller(
                current_document, docx_io, account_ID, token, current_user["name"]
            )
    except Exception as e:
        logging.exception("Could not sign document")
        dict_str = e.body.decode("utf-8")
        ans_json = ast.literal_eval(dict_str)
        if ans_json["errorCode"] == "ANCHOR_TAB_STRING_NOT_FOUND":
            error_JSON = {"message": "Missing Anchor String on Document text"}

        elif ans_json["errorCode"] == "AUTHORIZATION_INVALID_TOKEN":
            error_JSON = {"message": "Token is expired or invalid"}

        elif ans_json["errorCode"] == "USER_AUTHENTICATION_FAILED":
            error_JSON = {
                "message": "Invalid Docusign access token. User authentication failed"
            }

        else:
            error_JSON = {
                "message": "Something went wrong when trying to sign document, please check signers information"
            }

        return jsonify(error_JSON), 400

    return jsonify(DocumentSerializer().dump(current_document))


@documents_bp.route("/<int:document_id>/signers", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def save_signers(current_user, document_id):
    content = request.json
    if content:
        try:
            document = save_signers_controller(document_id, content)
        except Exception as e:
            abort(404, "Could not save document signers")
    else:
        abort(400, "no content")

    return jsonify(DocumentSerializer(many=False).dump(document))


@documents_bp.route("/<int:document_id>/void", methods=["PUT"])
@aws_auth.authentication_required
@get_local_user
def void_envelope(current_user, document_id):
    content = request.json
    try:
        document = get_document_controller(document_id)
    except Exception as e:
        abort(404, "Document not found")
    if document.sent != True:
        abort(400, "Document has not been sent to signing yet")
    if document.signed == True:
        abort(400, "Can't void an envelope that has finished signing")
    token = get_token(current_user)
    if token is None:
        abort(400, "Missing DocuSign user token")
    company = Company.query.get(current_user.get("company_id"))
    account_ID = company.docusign_account_id
    if account_ID == None:
        abort(400, "User has no Docusign Account ID registered")
    try:
        response = void_envelope_controller(
            document, document.envelope, token, account_ID
        )
    except Exception as e:
        abort(400, "Could not delete docusign envelope")

    return jsonify(DocumentSerializer(many=False).dump(document))


@documents_bp.route("/<int:document_id>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete_document(current_user, document_id):
    try:
        document = get_document_controller(document_id)
    except Exception:
        abort(404, "Document not Found")
    try:
        delete_document_controller(document)
    except Exception:
        logging.exception("The document could not be deleted")
        abort(400, "The document could not be deleted")
    msg_JSON = {"message": "The document was deleted"}

    return jsonify(msg_JSON), 200


@documents_bp.route("/<int:document_id>/modify", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def modify_document(current_user, document_id):
    # check if content_type is json
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    variables = content.get("variables", None)
    if not variables:
        return jsonify({"message": "Didn't receive new variables to replace"}), 400

    document = get_document_controller(document_id)

    if not document:
        abort(404, "Document not Found")
    if document.text_type != ".docx":
        abort(400, "Can only change variables of Word documents(.docx)")
    spec_variables = copy.deepcopy(variables)
    try:
        format_variables(spec_variables, document.document_template_id)
    except Exception as e:
        logging.exception(e)
        error_msg = "Variable specification is incorrect"
        return jsonify({"message": error_msg}), 400

    try:
        change_variables_controller(
            document, spec_variables, current_user["email"], variables
        )
    except Exception as e:
        logging.exception("Could not change document variables")
        abort(400, "Could not change document variables")

    return DocumentSerializer().dump(document)


@documents_bp.route("/<int:document_id>/edit_workflow", methods=["PATCH"])
@aws_auth.authentication_required
@get_local_user
def edit_document_workflow(current_user, document_id):
    content = request.json
    new_group = content.get("group", None)
    new_responsible_users = content.get("responsible_users", None)
    new_due_date = content.get("due_date", None)

    if new_group or new_responsible_users or new_due_date:
        document = get_document_controller(document_id)
        try:
            document = edit_document_workflow_controller(
                document, new_group, new_responsible_users, new_due_date
            )
        except Exception as e:
            logging.exception(e)
            return jsonify({"message": "Could not edit document workflow"}), 400
    else:
        return (
            jsonify({"message": "Must send group, responsibl_users or due_date"}),
            400,
        )

    return DocumentSerializer().dump(document)


@documents_bp.route("/<int:document_id>/certificate", methods=["GET"])
@authenticated_user
def get_document_certificate_file(current_user, document_id):
    control = {"status_code": 200, "message": "", "data": {}}
    document = get_document_controller(document_id)
    if document is None:
        control["status_code"] = 404
        control["message"] = "Document not Found"
    else:
        if (
            document.company.signatures_provider != "d4sign"
        ):  # feature only appliable to D4Sign for now
            control["status_code"] = 451
            control[
                "message"
            ] = "Signatures for this company are not provided through D4Sign"
        else:
            control = (
                d4sign_generate_document_certificate_file_presigned_url_controller(
                    user=current_user, document=document
                )
            )
    status_code = control.pop("status_code")
    return jsonify(control), status_code
