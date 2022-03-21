from os import abort
import logging
from re import sub
from sqlalchemy import desc
from werkzeug.exceptions import BadRequest, Unauthorized
from flask import request, Blueprint, jsonify, current_app, abort, redirect
from sqlalchemy.sql.expression import false
import stripe
import os
from werkzeug.exceptions import BadRequest, NotFound
from sentry_sdk import capture_exception

from app import aws_auth, db
from app.users.remote import get_local_user, authenticated_user
from app.models.company import Company
from app.models.user import User
from app.serializers.user_serializers import UserSerializer
from app.models.company import Company, Webhook
from app.serializers.company_serializers import (
    CompanySerializer,
    CompanyListSerializer,
    WebhookSerializer,
)

from .controllers import (
    create_company_controller,
    save_company_keys_controller,
    update_webhook_controller,
    upload_logo_controller,
    get_download_url_controller,
    create_webhook_controller,
    get_webhook_controller,
    assign_company_to_new_user_controller,
)

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
        logging.exception(e)
        return {}, 500

    return jsonify({"company": CompanySerializer().dump(company)})


@company_bp.route("/docusign", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def get_keys(logged_user):
    company = Company.query.get(logged_user["company_id"])
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

    if not logged_user["is_admin"]:
        return {}, 403

    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_param = str(request.args.get("search", ""))
    except:
        abort(400, "invalid parameters")

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
        }

        return company_info
    except:
        raise NotFound(description="Company not found")
