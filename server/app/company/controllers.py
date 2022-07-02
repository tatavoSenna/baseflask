import os
import stripe

from werkzeug.exceptions import BadRequest, Forbidden, NotFound
from sqlalchemy import desc, asc, delete

from app import db
from app.models.company import Company, Tag, Webhook
from app.models.user import User
from app.models.internal_database import TextItemTag
from .remote import RemoteCompany

stripe.api_key = os.environ.get("STRIPE_API_SECRET_KEY")


def save_company_keys_controller(
    company_id, docusign_integration_key, docusign_secret_key, docusign_account_id
):

    company = Company.query.get(company_id)

    company.signatures_provider = "docusign"

    if docusign_integration_key != None:
        company.docusign_integration_key = docusign_integration_key

    if docusign_secret_key != None:
        company.docusign_secret_key = docusign_secret_key

    if docusign_account_id != None:
        company.docusign_account_id = docusign_account_id

    db.session.commit()

    return company


def upload_logo_controller(company_id, logo_img):
    remote_company = RemoteCompany()
    url = remote_company.upload_logo(company_id, logo_img)

    return url


def get_download_url_controller(company_id):
    remote_company = RemoteCompany()
    url = remote_company.download_logo_url(company_id)

    return url


def create_webhook_controller(company_id, webhook, pdf, docx):
    webhook = Webhook(webhook=webhook, company_id=company_id, pdf=pdf, docx=docx)
    db.session.add(webhook)
    db.session.commit()
    return webhook


def get_webhook_controller(webhook_id):
    webhook = Webhook.query.filter_by(id=webhook_id).first()
    return webhook


def update_webhook_controller(webhook_id, url, pdf, docx):
    webhook = get_webhook_controller(webhook_id)

    if url is not None:
        webhook.webhook = url
    if pdf is not None:
        webhook.pdf = pdf
    if docx is not None:
        webhook.docx = docx

    db.session.add(webhook)
    db.session.commit()

    return webhook


def create_company_controller(logged_user, new_company_name):
    if logged_user["created"]:
        if not logged_user["is_admin"]:
            raise Forbidden(description="Only admin users can create new companies")

    company = Company.query.filter_by(name=new_company_name).first()

    if company:
        raise BadRequest(description="Company already exists")

    company_attributes = dict(name=new_company_name)
    new_company = Company(**company_attributes)

    db.session.add(new_company)
    db.session.commit()

    if not logged_user["created"]:
        assign_company_to_new_user_controller(logged_user, new_company.id)
    return new_company


def create_stripe_account_and_subscription(name: str, email: str):
    stripe.Customer.create(email=email, name=name)
    customer = stripe.Customer.list(email=email)
    customer_id = customer.data[0]["id"]
    if os.environ.get("ENVIRONMENT_TAG") == "production":
        price_id = "price_1Kfv9LHIZcJ4D4nawRSfC6t6"
    else:
        price_id = "price_1KP85XHIZcJ4D4nayv0Sx6dc"
    stripe.Subscription.create(customer=customer_id, items=[{"price": price_id}])


def assign_company_to_new_user_controller(logged_user, company_id):
    local_user = User.query.filter_by(sub=logged_user["sub"], active=True).first()
    default_company = Company.query.filter_by(id="1").first()
    user_attributes = dict(
        username=logged_user["username"],
        email=logged_user["email"],
        sub=logged_user["sub"],
        name=logged_user["name"],
        verified=False,
    )

    if local_user:
        local_user.email = logged_user["email"]
    else:
        if not company_id:
            if not default_company:
                company_id = None
            else:
                company_id = default_company.id
        user_attributes.update(company_id=company_id)
        local_user = User(**user_attributes)
        company = Company.query.filter_by(id=company_id).first()
        company.stripe_company_email = local_user.email
        local_user.is_financial = True
        create_stripe_account_and_subscription(local_user.name, local_user.email)

    deleted_user = User.query.filter_by(
        email=logged_user["email"], active=False
    ).first()

    if deleted_user:
        deleted_user.company_id = local_user.company_id
        deleted_user.is_financial = local_user.is_financial
        deleted_user.sub = local_user.sub
        deleted_user.username = local_user.username
        deleted_user.active = True
        db.session.add(deleted_user)
        db.session.commit()
        logged_user["created"] = True
        return deleted_user

    db.session.add(local_user)
    db.session.commit()
    logged_user["created"] = True
    return local_user


def get_tag_controller(user, tag_id):
    tag = Tag.query.get(tag_id)

    if not tag:
        raise NotFound()

    if user.company_id != tag.company_id:
        raise Forbidden()

    return tag


def list_tags_from_company_controller(
    user, page, per_page, search_term, order_by, order
):
    tags_query = Tag.query.filter_by(company_id=user.company_id)

    if search_term:
        tags_query = tags_query.filter(Tag.title.ilike(f"%{search_term}%"))

    order_by_dict = {
        "title": Tag.title,
        "created_at": Tag.created_at,
        "created_by": User.name,
    }
    order_dict = {
        "ascend": asc(order_by_dict[order_by]),
        "descend": desc(order_by_dict[order_by]),
    }

    if order_by == "created_by":
        tags_query = tags_query.join(Tag.created_by)

    tags_query = tags_query.order_by(order_dict[order])

    return tags_query.paginate(page=page, per_page=per_page)


def create_tag_controller(user, data):
    title = data.get("title", None)
    if not title:
        raise BadRequest()

    config = data.get("config", {})

    tag = Tag(
        company_id=user.company_id,
        title=title,
        config=config,
        created_by_id=user.id,
    )

    db.session.add(tag)
    db.session.commit()

    return tag


def update_tag_controller(user, tag_id, data):
    title = data.get("title", None)
    config = data.get("config", {})

    if not title and config == {}:
        raise BadRequest()

    tag = Tag.query.get(tag_id)

    if not tag:
        raise NotFound()

    if user.company_id != tag.company_id:
        raise Forbidden()

    if title:
        tag.title = title

    if config != {}:
        tag.config = config

    db.session.commit()

    return tag


def delete_tag_controller(user, tag_id):
    tag = Tag.query.get(tag_id)

    if not tag:
        raise NotFound()

    if user.company_id != tag.company_id:
        raise Forbidden()

    db.session.execute(delete(TextItemTag).where(TextItemTag.text_item_id == tag.id))

    db.session.delete(tag)
    db.session.commit()
