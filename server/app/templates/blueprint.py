from flask import request, Blueprint, abort, jsonify, current_app

from app import aws_auth, db
from app.users.remote import get_local_user

from .controllers import (
    create_template_controller
)

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
    company_id = current_user["company_id"]

    document_template_id = create_template_controller(
        company_id, name, form, workflow, signers)

    return jsonify(
        {
            "id": document_template_id
        }
    )
