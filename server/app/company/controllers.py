from app import db
from app.models.company import Company, Webhook
from .remote import RemoteCompany

def save_company_keys_controller(company_id, docusign_integration_key, docusign_secret_key, docusign_account_id):

    company = Company.query.get(company_id)

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

