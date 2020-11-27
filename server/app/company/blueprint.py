from flask import request, Blueprint, jsonify, current_app

from app import aws_auth, db
from app.users.remote import get_local_user
from app.models.company import Company
from app.serializers.company_serializers import CompanySerializer

from .controllers import (
    save_company_keys_controller
)

company_bp = Blueprint("company", __name__)


@company_bp.route("/<company_id>/docusign", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def save_keys(logged_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return {}, 404

    if logged_user['company_id'] != int(company_id):
        return {}, 401

    content = request.json
    docusign_integration_key = content.get("docusign_integration_key", None)
    docusign_secret_key = content.get("docusign_secret_key", None)
    docusign_account_id = content.get("docusign_account_id", None)

    try:
        save_keys = save_company_keys_controller(
            company=company,
            docusign_integration_key=docusign_integration_key,
            docusign_secret_key=docusign_secret_key,
            docusign_account_id=docusign_account_id
        )
    except:
        return {}, 500

    return jsonify({"company": CompanySerializer().dump(company)})
