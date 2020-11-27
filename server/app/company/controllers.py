from app import db
from app.models.company import Company


def save_company_keys_controller(company, docusign_integration_key, docusign_secret_key, docusign_account_id):
    if docusign_integration_key != None:
        company.docusign_integration_key = docusign_integration_key

    if docusign_secret_key != None:
        company.docusign_secret_key = docusign_secret_key

    if docusign_account_id != None:
        company.docusign_account_id = docusign_account_id

    db.session.commit()
