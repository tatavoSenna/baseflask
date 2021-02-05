from flask import request, Blueprint, abort, jsonify, current_app

from app import aws_auth, db
from app.users.remote import get_local_user
from app.serializers.document_serializers import DocumentTemplateListSerializer
from app.models.documents import DocumentTemplate

from .controllers import (
    create_template_controller
)
from sqlalchemy import desc

templates_bp = Blueprint("templates", __name__)


@templates_bp.route("/", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_template(current_user):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    name = content.get("name", None)
    if name == None:
        abort(400, 'Missing document name')
    form = content.get("form", None)
    workflow = content.get("workflow", None)
    signers = content.get("signers", None)
    template_text = content.get("text", None)
    company_id = current_user["company_id"]
    user_id = current_user["user_id"]

    document_template_id = create_template_controller(
        company_id, user_id, name, form, workflow, signers, template_text)

    return jsonify(
        {
            "id": document_template_id
        }
    )


@templates_bp.route("/")
@aws_auth.authentication_required
@get_local_user
def get_template_list(current_user):
    try:
        page = int(request.args.get(
            "page", current_app.config['PAGE_DEFAULT']))
        per_page = int(request.args.get(
            "per_page", current_app.config['PER_PAGE_DEFAULT']))
        search_param = str(request.args.get("search", ""))
    except:
        abort(400, "invalid parameters")

    paginated_query = (
        DocumentTemplate.query.filter_by(company_id=current_user["company_id"])
        .filter(DocumentTemplate.name.ilike(f"%{search_param}%"))
        .order_by(desc(DocumentTemplate.created_at))
        .paginate(page=page, per_page=per_page)
    )

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "items": DocumentTemplateListSerializer(many=True).dump(paginated_query.items),
        }
    )
