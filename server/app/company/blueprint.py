from os import abort
from sqlalchemy import desc
from flask import request, Blueprint, jsonify, current_app
from sqlalchemy.sql.expression import false

from app import aws_auth, db
from app.users.remote import get_local_user
from app.models.company import Company
from app.models.user import User
from app.serializers.company_serializers import CompanySerializer, CompanyListSerializer
from app.serializers.user_serializers import UserSerializer

from .controllers import (
    save_company_keys_controller,
    upload_logo_controller,
    get_download_url_controller
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
        save_company_keys_controller(
            company=company,
            docusign_integration_key=docusign_integration_key,
            docusign_secret_key=docusign_secret_key,
            docusign_account_id=docusign_account_id
        )
    except:
        return {}, 500

    return jsonify({"company": CompanySerializer().dump(company)})


@company_bp.route("/<company_id>/docusign", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_keys(logged_user, company_id):
    company = Company.query.get(company_id)
    if not company:
        return {}, 404

    if logged_user['company_id'] != int(company_id):
        return {}, 401

    return jsonify({"company": CompanySerializer().dump(company)})

@company_bp.route("/upload", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def upload_logo(logged_user):
    company_id = logged_user.get("company_id")

    if not company_id:
        return {}, 404

    content = request.json
    logo_img = content.get("img", None)
    url = upload_logo_controller(company_id, logo_img)

    return url

@company_bp.route("/download", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def download_logo_url(logged_user):
    company_id = logged_user.get("company_id")

    url = get_download_url_controller(company_id)

    return jsonify({"url": url})

@company_bp.route("/")
@aws_auth.authentication_required
@get_local_user
def get_company_list(logged_user):
    
    if not logged_user['is_admin']:
        print(logged_user)
        return {}, 403

    try:
        page = int(request.args.get("page", current_app.config['PAGE_DEFAULT']))
        per_page = int(request.args.get("per_page", current_app.config['PER_PAGE_DEFAULT']))
    except:
        abort(400, "invalid parameters")

    paginated_query = (
        Company.query.order_by(Company.name)
        .paginate(page=page, per_page=per_page)
    )

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "items": CompanyListSerializer(many=True).dump(paginated_query.items),
        }
    )



@company_bp.route("/", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_company(logged_user):
    if not logged_user['is_admin']:
        return {}, 403

    content = request.json
    company_name = content.get("company_name", None)
    if not company_name:
        return jsonify({"message": "Didn't receive a new company name"}), 400
   
    company = Company.query.filter_by(name=company_name).first()

    if company:
        return jsonify({"message": "Company already exists"}), 400

    company_attributes = dict(

                name = company_name
            )
    new_company = Company(**company_attributes)

    db.session.add(new_company)
    db.session.commit() 
    return jsonify({"company": CompanySerializer().dump(new_company)})

    
@company_bp.route("/join", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def change_company(logged_user):
    if not logged_user['is_admin']:
        return {}, 403
    
    user = User.query.filter_by(id=logged_user["id"]).first()

    content = request.json
    new_id = content.get("new_id", None)
   
    user.company_id = new_id

    db.session.add(user)
    db.session.commit() 

    return jsonify({"user": UserSerializer().dump(user)})
