from app.company.controllers import save_company_keys_controller
from app.test import factories
import pytest


def test_save_keys():
    company = factories.CompanyFactory()
    docusign_integration_key = "34545tgwc45g56vg5ee5"
    docusign_secret_key = "453456574yf4hyv6h767"
    docusign_account_id = "34534ft345g6y46h"

    save_company_keys_controller(
        company, docusign_integration_key, docusign_secret_key, docusign_account_id)

    assert company.docusign_integration_key == docusign_integration_key
    assert company.docusign_secret_key == docusign_secret_key
    assert company.docusign_account_id == docusign_account_id

    docusign_integration_key = ""
    docusign_secret_key = None
    docusign_account_id = "67534fty75g6c86h"

    save_company_keys_controller(company, docusign_integration_key, docusign_secret_key, docusign_account_id)
    
    assert company.docusign_integration_key == docusign_integration_key
    assert company.docusign_secret_key == "453456574yf4hyv6h767"
    assert company.docusign_account_id == docusign_account_id
