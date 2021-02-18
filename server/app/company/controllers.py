from app import db
from app.models.company import Company
from .remote import RemoteCompany

def get_company_controller(company_id):
    company = Company.query.filter_by(id=company_id).first()
    return company

def save_company_keys_controller(company, docusign_integration_key, docusign_secret_key, docusign_account_id):
    if docusign_integration_key != None:
        company.docusign_integration_key = docusign_integration_key

    if docusign_secret_key != None:
        company.docusign_secret_key = docusign_secret_key

    if docusign_account_id != None:
        company.docusign_account_id = docusign_account_id

    db.session.commit()

def upload_logo_controller(company_id, logo_img):

    remote_company = RemoteCompany()
    url = remote_company.upload_logo(company_id, logo_img)

    company = get_company_controller(company_id)
    company.logo_url = url

    db.session.add(company)
    db.session.commit()
    return url
