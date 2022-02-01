from cgi import test
from sqlalchemy import exc

from app import db
from app.company.controllers import (
    create_webhook_controller,
    save_company_keys_controller,
    update_webhook_controller, 
    upload_logo_controller,
    get_download_url_controller,
    assign_company_to_new_user_controller,
    create_company_controller
)
from app.test import factories
from app.models import User, Company

import pytest
import io
from flask import current_app
from unittest.mock import patch
import copy
from faker import Faker

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

def test_company_signatures_provider_initialization():
    company = factories.CompanyFactory()
    db.session.commit()
    assert company.signatures_provider == 'docusign'
    company = factories.CompanyFactory(signatures_provider='not permitted')
    with pytest.raises(exc.StatementError):
        db.session.commit()
    db.session.rollback()
    company = factories.CompanyFactory(signatures_provider='d4sign')
    db.session.commit()
    assert company.signatures_provider == 'd4sign'
    company.signatures_provider = None
    db.session.commit()
    assert company.signatures_provider is None
    db.session.delete(company)
    db.session.commit()

def test_create_company_by_non_admin_user(session):
    fake = Faker()

    company_name = "Test company"

    created_non_admin_user = {
        "name": "Test User 1",
        "username": fake.slug(),
        "sub": fake.uuid4(),
        "email": fake.email(),
        "created": True,
        "is_admin": False
    }

    response = create_company_controller(created_non_admin_user, company_name)

    assert response == ({}, 403)


def test_create_company_by_admin_user(session):
    fake = Faker()

    company_name = "Test company"

    created_admin_user = {
        "name": "Test User 1",
        "username": fake.slug(),
        "sub": fake.uuid4(),
        "email": fake.email(),
        "created": True,
        "is_admin": True
    }

    response = create_company_controller(created_admin_user, company_name)
    company = session.query(Company).filter_by(name=company_name).one()    

    assert company is not None
    assert company.name == company_name
    assert response == company
    assert company.id > 0

def test_assign_company_to_new_user(session):
    fake = Faker()

    test_user = {
        "name": "Test User",
        "username": fake.slug(),
        "sub": fake.uuid4(),
        "email": fake.email(),
        "created": False
    }

    company_name = "Test company"

    create_company_controller(test_user, company_name)

    user = session.query(User).filter_by(sub=test_user["sub"]).one()
    company = session.query(Company).filter_by(name=company_name).one()    

    assert user is not None
    assert user.sub == test_user["sub"]
    assert user.name == test_user["name"]
    assert user.username == test_user["username"]
    assert user.email == test_user["email"]
    assert test_user["created"] == True
    assert user.company_id == company.id
