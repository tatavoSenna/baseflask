from app.company.controllers import (
    save_company_keys_controller, 
    upload_logo_controller,
    get_download_url_controller
)
from app.test import factories
import pytest
import io
from flask import current_app
from unittest.mock import patch

def test_save_keys():
    company = factories.CompanyFactory()
    docusign_integration_key = "34545tgwc45g56vg5ee5"
    docusign_secret_key = "453456574yf4hyv6h767"
    docusign_account_id = "34534ft345g6y46h"

    save_company_keys_controller(
        company.id, docusign_integration_key, docusign_secret_key, docusign_account_id)

    assert company.docusign_integration_key == docusign_integration_key
    assert company.docusign_secret_key == docusign_secret_key
    assert company.docusign_account_id == docusign_account_id

    docusign_integration_key = ""
    docusign_secret_key = None
    docusign_account_id = "67534fty75g6c86h"

    save_company_keys_controller(company.id, docusign_integration_key, docusign_secret_key, docusign_account_id)
    
    assert company.docusign_integration_key == docusign_integration_key
    assert company.docusign_secret_key == "453456574yf4hyv6h767"
    assert company.docusign_account_id == docusign_account_id

@ patch('app.company.controllers.RemoteCompany.upload_logo')
def test_upload_logo(upload_logo_mock):
    company_id = 123
    company = factories.CompanyFactory(id=company_id)

    logo_img = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

    upload_logo_controller(company.id, logo_img)

    upload_logo_mock.assert_called_once_with(company.id, logo_img)

@ patch('app.company.controllers.RemoteCompany.download_logo_url')
def test_download_logo(download_logo_mock):
    company_id = 123
    company = factories.CompanyFactory(id=company_id)

    get_download_url_controller(company.id)

    download_logo_mock.assert_called_once_with(company.id)



