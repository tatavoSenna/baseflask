from app import db
from app.models.company import Company, Webhook
from app.models.user import User
from .remote import RemoteCompany

def save_company_keys_controller(company_id, docusign_integration_key, docusign_secret_key, docusign_account_id):

    company = Company.query.get(company_id)

    company.signatures_provider = 'docusign'

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

def assign_company_to_new_user_controller(logged_user, company_id):
        local_user = User.query.filter_by(sub=logged_user["sub"], active=True).first()
        default_company = Company.query.filter_by(id="1").first()
        user_attributes = dict(
            username=logged_user["username"], email=logged_user["email"], sub=logged_user["sub"], name=logged_user["name"], verified=False
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

        db.session.add(local_user)
        db.session.commit()
        return local_user
