import stripe
import os

from werkzeug.exceptions import BadRequest, Unauthorized, NotFound, Forbidden
from flask import request, Blueprint, jsonify, current_app, abort, redirect
from sentry_sdk import capture_exception
from werkzeug.utils import secure_filename

from app import aws_auth, db
from app.users.remote import get_local_user, authenticated_user
from app.models.company import Company
from app.models.user import User
from app.serializers.user_serializers import UserSerializer
from app.models.company import Company, Webhook
from app.serializers.company_serializers import *
from .controllers import *

company_bp = Blueprint("company", __name__)
stripe.api_key = os.environ.get("STRIPE_API_SECRET_KEY")


@company_bp.route("/docusign", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def save_keys(logged_user):
    content = request.json
    docusign_integration_key = content.get("docusign_integration_key", None)
    docusign_secret_key = content.get("docusign_secret_key", None)
    docusign_account_id = content.get("docusign_account_id", None)

    try:
        company = save_company_keys_controller(
            company_id=logged_user["company_id"],
            docusign_integration_key=docusign_integration_key,
            docusign_secret_key=docusign_secret_key,
            docusign_account_id=docusign_account_id,
        )
    except Exception as e:
        return {}, 500

    return jsonify({"company": CompanySerializer().dump(company)})


@company_bp.route("/docusign", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_keys(logged_user):
    company = Company.query.get(logged_user["company_id"])
    return jsonify({"company": CompanySerializer().dump(company)})


@company_bp.route("/basedocument/upload", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def upload_base_document(logged_user):
    company_id = logged_user.get("company_id")

    if not company_id:
        return {}, 404

    uploaded_file = request.files["file"]
    file_name = secure_filename(uploaded_file.filename)

    if file_name == "":
        abort(400, "Missing file")

    upload_base_document_controller(company_id, uploaded_file, file_name)

    return jsonify({"message": "Successfully upload base document file"})


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
    if not logged_user["is_admin"]:
        return {}, 403

    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_param = str(request.args.get("search", ""))
        list_all = int(request.args.get("list_all", 0))
    except:
        abort(400, "invalid parameters")

    # This is to list all companies when duplicating a template
    if list_all:
        company_list = Company.query.all()
        return jsonify({"items": CompanyListSerializer(many=True).dump(company_list)})
    else:
        paginated_query = (
            Company.query.order_by(Company.name)
            .filter(Company.name.ilike(f"%{search_param}%"))
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
@get_local_user(raise_forbidden=False)
def create_company(logged_user):
    content = request.json
    company_name = content.get("company_name", None)
    if not company_name:
        raise BadRequest(description="Didn't receive a new company name")

    new_company = create_company_controller(logged_user, company_name)

    return jsonify({"company": CompanySerializer().dump(new_company)})


@company_bp.route("/join", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def change_company(logged_user):
    if not logged_user["is_admin"]:
        return {}, 403

    user = User.query.filter_by(id=logged_user["id"]).first()

    content = request.json
    new_id = content.get("new_id", None)

    user.company_id = new_id

    db.session.add(user)
    db.session.commit()

    return jsonify({"user": UserSerializer().dump(user)})


@company_bp.route("/webhook")
@aws_auth.authentication_required
@get_local_user
def get_webhook_list(logged_user):
    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
    except:
        abort(400, "invalid parameters")

    paginated_query = Webhook.query.order_by(Webhook.webhook).paginate(
        page=page, per_page=per_page
    )

    return jsonify(
        {
            "page": paginated_query.page,
            "per_page": paginated_query.per_page,
            "total": paginated_query.total,
            "items": WebhookSerializer(many=True).dump(paginated_query.items),
        }
    )


@company_bp.route("/webhook", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_webhook(logged_user):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    company = Company.query.get(logged_user["company_id"])

    content = request.json
    url = content.get("url", None)
    pdf = content.get("pdf", False)
    docx = content.get("docx", False)

    webhook = create_webhook_controller(company.id, url, pdf, docx)

    return jsonify({"webhook": WebhookSerializer().dump(webhook)})


@company_bp.route("/webhook/<int:webhook_id>", methods=["DELETE"])
@aws_auth.authentication_required
@get_local_user
def delete_webhook(logged_user, webhook_id):
    try:
        webhook = get_webhook_controller(webhook_id)
        if not webhook:
            abort(404, "Webhook not Found")
    except Exception:
        abort(404, "Webhook not Found")

    db.session.delete(webhook)
    db.session.commit()

    msg_JSON = {"message": "Webhook deleted"}

    return jsonify(msg_JSON), 200


@company_bp.route("/webhook/edit/<int:webhook_id>", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def edit_webhook(logged_user, webhook_id):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    content = request.json
    url = content.get("url", None)
    pdf = content.get("pdf", None)
    docx = content.get("docx", None)
    try:
        webhook = update_webhook_controller(webhook_id, url, pdf, docx)
    except Exception:
        abort(500, "Could not update webhook. Check if the id provided is correct.")

    return jsonify({"webhook": WebhookSerializer().dump(webhook)})


# Endpoint missing authentication
# While there is no authentication, we're using
# the user's email provided by the frontend
@company_bp.route("/checkout", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def create_checkout_session(logged_user):
    fields = request.get_json()
    if not "price_id" in fields:
        raise BadRequest(description="No price id sent.")

    # Get customer id based on logged user's email.
    # User should be added to stripe's customer list upon creation,
    # but if it isn't, add him before creating checkout session
    if logged_user["is_financial"]:
        try:
            company = Company.query.get(logged_user["company_id"])
            customer = stripe.Customer.list(email=company.stripe_company_email)
            customer_id = customer.data[0].id
        except Exception as e:
            stripe.Customer.create(email=logged_user["email"], name=logged_user["name"])
            customer = stripe.Customer.list(email=logged_user["email"])
            customer_id = customer.data[0].id
    else:
        raise Unauthorized(
            description="User is not financially responsible for the company"
        )

    # Get list of customer's subscriptions to check if there is an active subscription,
    # if there is, redirect customer to portal instead of checkout
    subscription_list = stripe.Subscription.list(customer=customer_id, status="active")
    active_subscription = (
        subscription_list["data"][0]["id"]
        if "data" in subscription_list and len(subscription_list["data"]) > 0
        else None
    )

    # The customer doesn't have an active subscription
    if not active_subscription:
        try:
            price = stripe.Price.retrieve(
                fields["price_id"],
            )

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price": price["id"],
                        "quantity": 1,
                    },
                ],
                customer=customer_id,
                mode="subscription",
                success_url="https://"
                + os.environ.get("DOMAIN_URL")
                + "/settings?session_id={CHECKOUT_SESSION_ID}",
                cancel_url="https://" + os.environ.get("DOMAIN_URL") + "/settings",
            )
            return jsonify({"url": checkout_session.url}), 201
        except Exception as e:
            capture_exception(e)
            return "An error occurred on Stripe.", 400
    # The customer has an active subscription
    else:
        return_url = "https://" + os.environ.get("DOMAIN_URL") + "/settings"

        portal_session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url,
        )
        return jsonify({"url": portal_session.url}), 201


@company_bp.route("/portal", methods=["POST"])
@aws_auth.authentication_required
@get_local_user
def customer_portal(logged_user):
    customer = stripe.Customer.list(email=logged_user["email"])
    try:
        customer_id = customer.data[0].id
    except Exception as e:
        return "No customer on stripe with given email", 403

    return_url = "https://" + os.environ.get("DOMAIN_URL") + "/settings"

    portal_session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    return jsonify({"url": portal_session.url}), 201


@company_bp.route("/stripe_plan", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_user_stripe_plan(logged_user):
    try:
        customer = stripe.Customer.list(email=logged_user["email"])
        customer_id = customer.data[0].id
    except Exception as e:
        return (
            jsonify({"price_id": None, "expires_at": None, "is_canceled": False}),
            200,
        )

    subscription_list = stripe.Subscription.list(customer=customer_id, status="active")
    active_subscription = (
        subscription_list["data"][0]["id"]
        if "data" in subscription_list and len(subscription_list["data"]) > 0
        else None
    )

    if not active_subscription:
        return (
            jsonify({"price_id": None, "expires_at": None, "is_canceled": False}),
            200,
        )
    else:
        price_id = subscription_list["data"][0]["items"]["data"][0]["price"]["id"]
        is_canceled = (
            True if subscription_list["data"][0]["canceled_at"] is not None else False
        )
        return (
            jsonify(
                {
                    "price_id": price_id,
                    "expires_at": subscription_list["data"][0]["current_period_end"],
                    "is_canceled": is_canceled,
                }
            ),
            200,
        )


@company_bp.route("/info", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_company_info(logged_user):
    try:
        company = Company.query.filter_by(id=logged_user["company_id"]).first()

        company_info = {
            "id": company.id,
            "name": company.name,
            "stripe_company_email": company.stripe_company_email,
            "remaining_documents": company.remaining_documents,
            "base_document": company.base_document,
        }

        return company_info
    except:
        raise NotFound(description="Company not found")


# Get specific Tag based on id
@company_bp.route("/tag/<int:tag_id>", methods=["GET"])
@authenticated_user
def get_tag_detail(current_user, tag_id):
    try:
        tag = get_tag_controller(current_user, tag_id)
    except NotFound as e:
        return jsonify({"Tag not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Tag"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(TagSerializer(many=False).dump(tag)), 200


# List all Tags from user's company
@company_bp.route("/tags", methods=["GET"])
@authenticated_user
def list_tags_from_company(current_user):
    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_term = str(request.args.get("search", ""))

        order_by = str(request.args.get("order_by", "created_at"))
        order = str(request.args.get("order", "descend"))
    except Exception as e:
        return BadRequest(description="Malformed parameters")

    text_items_query = list_tags_from_company_controller(
        current_user, page, per_page, search_term, order_by, order
    )

    return (
        jsonify(
            {
                "page": text_items_query.page,
                "per_page": text_items_query.per_page,
                "total": text_items_query.total,
                "items": TagListSerializer(many=True).dump(text_items_query.items),
            }
        ),
        200,
    )


# Create tag
@company_bp.route("/tag", methods=["POST"])
@authenticated_user
def create_tag(current_user):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    try:
        tag = create_tag_controller(current_user, request.json)
    except BadRequest as e:
        return jsonify({"Missing fields"}), 400
    except NotFound as e:
        return jsonify({"Tag not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Tag"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(TagSerializer(many=False).dump(tag)), 201


# Update tag's title or config
@company_bp.route("/tag/<int:tag_id>", methods=["PATCH"])
@authenticated_user
def update_tag(current_user, tag_id):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    try:
        tag = update_tag_controller(current_user, tag_id, request.json)
    except BadRequest as e:
        return jsonify({"Missing fields"}), 400
    except NotFound as e:
        return jsonify({"Tag not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Tag"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(TagSerializer(many=False).dump(tag)), 200


# Delete tag and relations text-tag
@company_bp.route("/tag/<int:tag_id>", methods=["DELETE"])
@authenticated_user
def delete_tag(current_user, tag_id):
    try:
        delete_tag_controller(current_user, tag_id)
    except NotFound as e:
        return jsonify({"Tag not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Tag"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify({}), 200
