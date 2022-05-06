import os
import logging

from flask import request, Blueprint, abort, jsonify, current_app
from werkzeug.utils import secure_filename
from werkzeug.exceptions import BadRequest, NotFound, Forbidden
from sqlalchemy import desc, nulls_last

from app import aws_auth, db
from app.users.remote import authenticated_user, get_local_user
from app.serializers.document_serializers import DocumentTemplateListSerializer
from app.serializers.template_serializers import TemplateSerializer
from app.models.documents import DocumentTemplate

from .controllers import (
    create_template_controller,
    duplicate_template,
    edit_template_controller,
    get_template_controller,
    delete_template_controller,
    upload_file_to_template_controller,
    download_template_text_controller,
    get_document_upload_url,
    template_status_controller,
    template_favorite_controller,
)


templates_bp = Blueprint("templates", __name__)


@templates_bp.route("/", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_template(current_user):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    name = content.get("title", None)
    if name == None:
        abort(400, "Missing template name")
    form = content.get("form", None)
    workflow = content.get("workflow", None)
    signers = content.get("signers", None)
    template_text = content.get("text", None)
    company_id = current_user["company_id"]
    user_id = current_user["id"]
    text_type = content.get("text_type", None)
    variables = content.get("variables", None)

    document_template_id = create_template_controller(
        company_id,
        user_id,
        name,
        form,
        workflow,
        signers,
        template_text,
        text_type,
        variables,
    )

    return jsonify({"id": document_template_id})


@templates_bp.route("/<int:template_id>", methods=["PATCH"])
@aws_auth.authentication_required
@get_local_user
def edit_template(current_user, template_id):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    name = content.get("title", None)
    form = content.get("form", None)
    workflow = content.get("workflow", None)
    signers = content.get("signers", None)
    template_text = content.get("text", None)
    text_type = content.get("text_type", None)
    variables = content.get("variables", None)
    company_id = current_user["company_id"]
    user_id = current_user["id"]

    document_template_id = edit_template_controller(
        company_id,
        user_id,
        template_id,
        name,
        form,
        workflow,
        signers,
        template_text,
        text_type,
        variables,
    )

    return jsonify({"id": document_template_id})


@templates_bp.route("/<int:template_id>")
@aws_auth.authentication_required
@get_local_user
def get_template_detail(current_user, template_id):
    try:
        template = get_template_controller(current_user["company_id"], template_id)
        if not template:
            abort(404, "Template not Found")
    except Exception:
        abort(404, "Template not Found")
    return jsonify(TemplateSerializer(many=False).dump(template))


@templates_bp.route("/<int:template_id>/text")
@aws_auth.authentication_required
@get_local_user
def get_template_text(current_user, template_id):
    try:
        textfile = download_template_text_controller(
            current_user["company_id"], template_id
        )
    except Exception:
        abort(404, "Template not Found")
    return jsonify(textfile.decode("utf-8"))


@templates_bp.route("/")
@aws_auth.authentication_required
@get_local_user
def get_template_list(current_user):
    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_param = str(request.args.get("search", ""))
    except:
        abort(400, "invalid parameters")

    paginated_query = (
        DocumentTemplate.query.filter_by(company_id=current_user["company_id"])
        .filter(DocumentTemplate.name.ilike(f"%{search_param}%"))
        .order_by(
            nulls_last(desc(DocumentTemplate.favorite)),
            desc(DocumentTemplate.created_at),
        )
        .paginate(page=page, per_page=per_page)
    )

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "items": DocumentTemplateListSerializer(many=True).dump(
                paginated_query.items
            ),
        }
    )


@templates_bp.route("/<int:document_template_id>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete_document_template(current_user, document_template_id):
    try:
        document_template = get_template_controller(
            current_user["company_id"], document_template_id
        )
        if document_template == None:
            raise Exception
    except Exception:
        abort(404, "Template not Found")
    try:
        delete_template_controller(document_template)
    except Exception:
        abort(
            400,
            "The document template could not be deleted, there are documents linked to it",
        )
    msg_JSON = {"message": "The document template was deleted"}

    return jsonify(msg_JSON), 200


@templates_bp.route("/<int:document_template_id>/upload", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def upload_file_to_template(current_user, document_template_id):
    uploaded_file = request.files["file"]
    filename = secure_filename(uploaded_file.filename)

    if filename == "":
        abort(400, "Missing file")

    file_root, file_ext = os.path.splitext(filename)

    document_template = get_template_controller(
        current_user["company_id"], document_template_id
    )
    if document_template is None:
        abort(404, "Template not found")

    if file_ext != document_template.text_type:
        abort(400, "File extension not accepted")

    upload_file_to_template_controller(
        uploaded_file, filename, file_root, document_template_id
    )

    return jsonify({"message": "Successfully upload file to document template"})


@templates_bp.route("/<int:document_template_id>/getupload", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_upload(current_user, document_template_id):
    template = get_template_controller(current_user["company_id"], document_template_id)
    if not template:
        abort(404, "Template not found")
    if template.filename is None:
        abort(400, "There is no document to download")
    try:
        doc_url = get_document_upload_url(template)
    except Exception:
        logging.exception("Could not get download url")
        abort(400, "Could not get download url")
    response = {"download_url": doc_url}
    return jsonify(response)


@templates_bp.route("/<int:document_template_id>/publish", methods=["PATCH"])
@aws_auth.authentication_required
@get_local_user
def set_published(current_user, document_template_id):
    template = get_template_controller(current_user["company_id"], document_template_id)
    if not request.is_json:
        return abort(404, "Accepts only content-type json.")
    if not template:
        abort(404, "Template not found")

    status = request.json.get("status", None)
    company_id = current_user["company_id"]
    user_id = current_user["id"]

    template_id = template_status_controller(company_id, user_id, template.id, status)

    return jsonify({"id": template_id, "status": status})


@templates_bp.route("/<int:document_template_id>/favorite", methods=["PATCH"])
@aws_auth.authentication_required
@get_local_user
def set_favorite(current_user, document_template_id):
    template = get_template_controller(current_user["company_id"], document_template_id)
    if not request.is_json:
        return abort(404, "Accepts only content-type json.")
    if not template:
        abort(404, "Template not found")

    status = request.json.get("status", None)
    company_id = current_user["company_id"]

    template_id = template_favorite_controller(company_id, template.id, status)

    return jsonify({"id": template_id, "status": status})


@templates_bp.route("/<int:document_template_id>/duplicate", methods=["POST"])
@authenticated_user
def duplicate(current_user, document_template_id):
    if not request.is_json:
        return abort(404, "Accepts only content-type json.")

    try:
        template = get_template_controller(
            current_user.company_id, document_template_id
        )
    except:
        raise NotFound(description="Template does not exist.")

    outside_duplication = False
    company_id = request.json.get("company_id", None)
    if company_id and company_id != current_user.company_id:
        if not current_user.is_admin:
            raise Forbidden(description="User is not allowed to do this action.")
        outside_duplication = True

    return_value = duplicate_template(
        template, current_user["id"], company_id, outside_duplication
    )

    if return_value:
        return jsonify({"message": "Template duplicated succesfully."}), 201
    else:
        return jsonify(
            {
                "message": "Something went wrong while duplicating the template.",
                "status": 400,
            }
        )
