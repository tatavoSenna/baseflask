from app.company.controllers import (
    create_webhook_controller,
    save_company_keys_controller,
    update_webhook_controller, 
    upload_logo_controller,
    get_download_url_controller
)
from app.test import factories
import pytest
import io
from flask import current_app
from unittest.mock import patch
import copy

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

def test_update_webhook():

    # Create fake company and fake webhook
    id = 123
    company_id = 123
    company = factories.CompanyFactory(id=company_id)
    webhook = factories.WebhookFactory(id=id,company_id = company_id, pdf = False, docx = False)

    # Copies webhook to test if changes are being made correctly
    comparison_webhook = copy.deepcopy(webhook)

    # Test not changing anythings and check if it is still the same
    pdf = None
    docx = None
    url = None
    updated_webhook = update_webhook_controller(webhook.id, url, pdf, docx)
    assert updated_webhook.pdf == comparison_webhook.pdf
    assert updated_webhook.docx == comparison_webhook.docx
    assert updated_webhook.webhook == comparison_webhook.webhook

    # Test changing everything and check if everything is changed correctly
    pdf = True
    docx = True
    url = "http://test.com"
    updated_webhook = update_webhook_controller(webhook.id, url, pdf, docx)
    assert updated_webhook.pdf == True
    assert updated_webhook.docx == True
    assert updated_webhook.webhook == "http://test.com"

def test_create_webhook():
    company_id = 1
    company = factories.CompanyFactory(id=company_id)
    url = "http://test.com"
    pdf = True
    docx = True

    webhook = create_webhook_controller(company_id, url, pdf, docx)
    assert webhook.pdf == True
    assert webhook.docx == True
    assert webhook.webhook == "http://test.com"


