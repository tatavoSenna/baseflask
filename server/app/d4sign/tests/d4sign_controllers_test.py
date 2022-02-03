import pytest

from datetime import date
from unittest.mock import patch

from app.test import factories

from ..controllers import (
    d4sign_get_company_info_controller,
    d4sign_update_company_info_controller,
    d4sign_document_webhook_controller,
    d4sign_upload_document_controller,
    d4sign_register_document_signers_controller,
    d4sign_register_document_webhook_controller,
    d4sign_upload_and_send_document_for_signing_controller,
    d4sign_send_document_for_signing_controller,
)


@pytest.fixture
def company():
    return factories.CompanyFactory(signatures_provider="d4sign")


@pytest.fixture
def user(company):
    return factories.UserFactory(
        company=company,
    )


@pytest.fixture
def signers():
    return [
        {
            "status": "",
            "signing_date": "",
            "fields": [{"type": "email", "variable": "EMAIL_0"}],
        },
        {
            "status": "",
            "signing_date": "",
            "fields": [{"type": "email", "variable": "EMAIL_1"}],
        },
    ]


@pytest.fixture
def variables():
    return {"EMAIL_0": "0@mail.com", "EMAIL_1": "1@mail.com"}


@pytest.fixture
def document(company, user, signers, variables):
    return factories.DocumentFactory(
        company=company,
        user=user,
        signers=signers,
        variables=variables,
        d4sign_document_uuid="a1-b2-c3",
        text_type=".docx",
    )


# Test d4sign_get_company_info_controller
def test_d4sign_get_company_info_controller_company_not_found(user, company):
    control = d4sign_get_company_info_controller(user=user, company_id=company.id + 1)
    assert control["status_code"] == 404
    assert control["data"] == {}


def test_d4sign_get_company_info_controller_prohibited_user(company):
    other_user = factories.UserFactory()

    control = d4sign_get_company_info_controller(user=other_user, company_id=company.id)
    assert control["status_code"] == 403
    assert control["data"] == {}


def test_d4sign_get_company_info_controller_successfully_retrieved(user, company):
    company.d4sign_api_token = "token_a1-b2-c3"
    company.d4sign_api_cryptkey = "cryptkey_a1-b2-c3"
    company.d4sign_api_hmac_secret = "hmac_secret_a1-b2-c3"
    company.d4sign_safe_name = "Lawing Documents"

    control = d4sign_get_company_info_controller(user=user, company_id=company.id)
    assert control["status_code"] == 200
    assert control["data"]["company_info"]["id"] == company.id
    assert control["data"]["company_info"]["d4sign_api_token"] == "token_a1-b2-c3"
    assert control["data"]["company_info"]["d4sign_safe_name"] == "Lawing Documents"
    # asserts secret fields are unrevealed
    for secret_field in ["d4sign_api_cryptkey", "d4sign_api_hmac_secret"]:
        assert control["data"]["company_info"][secret_field] == "*"
    # asserts Company object is unchanged
    assert company.d4sign_api_token == "token_a1-b2-c3"
    assert company.d4sign_api_cryptkey == "cryptkey_a1-b2-c3"
    assert company.d4sign_api_hmac_secret == "hmac_secret_a1-b2-c3"
    assert company.d4sign_safe_name == "Lawing Documents"


# Test d4sign_update_company_info_controller
def test_d4sign_update_company_info_controller_company_not_found(user, company):
    control = d4sign_update_company_info_controller(
        user=user, company_id=company.id + 1
    )
    assert control["status_code"] == 404
    assert control["data"] == {}


def test_d4sign_update_company_info_controller_prohibited_user(company):
    other_user = factories.UserFactory()

    control = d4sign_update_company_info_controller(
        user=other_user, company_id=company.id
    )
    assert control["status_code"] == 403
    assert control["data"] == {}


def test_d4sign_update_company_info_controller_changes_signatures_provider(
    user, company
):
    company.signatures_provider = "docusign"

    control = d4sign_update_company_info_controller(user=user, company_id=company.id)
    assert control["status_code"] == 200
    assert control["data"]["updated_fields"]["signatures_provider"] == {
        "old": "docusign",
        "new": "d4sign",
    }


def test_d4sign_update_company_info_controller_successfully_updated(user, company):
    company.d4sign_api_token = "token_a1-b2-c3"
    company.d4sign_api_cryptkey = "cryptkey_a1-b2-c3"
    company.d4sign_api_hmac_secret = "hmac_secret_a1-b2-c3"
    company.d4sign_safe_name = "Lawing Documents X"

    control = d4sign_update_company_info_controller(
        user=user,
        company_id=company.id,
        d4sign_api_token="token_x1-y2-z3",
        d4sign_api_cryptkey="cryptkey_x1-y2-z3",
        d4sign_api_hmac_secret="hmac_secret_x1-y2-z3",
        d4sign_safe_name="Lawing Documents Y",
    )
    assert control["status_code"] == 200
    assert control["data"]["company_id"] == company.id
    assert control["data"]["updated_fields"]["d4sign_api_token"] == {
        "old": "token_a1-b2-c3",
        "new": "token_x1-y2-z3",
    }
    assert control["data"]["updated_fields"]["d4sign_safe_name"] == {
        "old": "Lawing Documents X",
        "new": "Lawing Documents Y",
    }
    for secret_field in ["d4sign_api_cryptkey", "d4sign_api_hmac_secret"]:
        assert control["data"]["updated_fields"][secret_field] == {
            "old": None,
            "new": None,
        }


# Test d4sign_upload_document_controller


def test_d4sign_upload_document_controller_already_uploaded(document):
    original_d4sign_document_uuid = document.d4sign_document_uuid

    control = d4sign_upload_document_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 202
    assert document.d4sign_document_uuid == original_d4sign_document_uuid


@patch("app.d4sign.controllers.RemoteDocument.download_docx_from_documents")
@patch("app.d4sign.controllers.D4SignAPI.upload_document_file")
def test_d4sign_upload_document_controller_successfully_uploaded(
    upload_document_file, download_docx_from_documents, document
):
    document.d4sign_document_uuid = None

    download_docx_from_documents.return_value = None
    upload_document_file.return_value = {"uuid": "a1-b2-c3"}

    control = d4sign_upload_document_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 200
    assert document.d4sign_document_uuid == "a1-b2-c3"


# Test d4sign_register_document_webhook_controller


def test_d4sign_register_document_webhook_controller_document_not_uploaded_yet(
    document,
):
    document.d4sign_document_uuid = None

    control = d4sign_register_document_webhook_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 403
    assert document.d4sign_document_uuid is None


@patch("app.d4sign.controllers.D4SignAPI.register_document_webhook")
def test_d4sign_register_document_webhook_controller_successfully_registered(
    register_document_webhook, document
):
    register_document_webhook.return_value = {
        "message": "Success",
        "document_webhook_url": "https://webhook.com/",
    }

    control = d4sign_register_document_webhook_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 200
    assert control["data"]["d4sign_document_uuid"] == "a1-b2-c3"
    assert control["data"]["document_webhook_url"] == "https://webhook.com/"


# Test d4sign_register_document_signers_controller


def test_d4sign_register_document_signers_controller_document_not_uploaded_yet(
    document,
):
    document.d4sign_document_uuid = None

    control = d4sign_register_document_signers_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 403
    assert document.d4sign_document_uuid is None


@patch("app.d4sign.controllers.D4SignAPI.register_document_signer")
def test_d4sign_register_document_signers_controller_successfully_registered(
    register_document_signer, document
):
    register_document_signer.return_value = {"message": [{"success": "1"}]}

    control = d4sign_register_document_signers_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 200
    assert control["data"]["registered_emails"] == ["0@mail.com", "1@mail.com"]

    for signer in document.signers:
        assert signer["status"] == "registered"


# Test d4sign_send_document_for_signing_controller


def test_d4sign_send_document_for_signing_controller_document_not_uploaded_yet(
    document,
):
    document.d4sign_document_uuid = None

    control = d4sign_send_document_for_signing_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 403
    assert document.d4sign_document_uuid is None


@patch("app.d4sign.controllers.D4SignAPI.send_document_for_signing")
def test_d4sign_send_document_for_signing_controller_successfully_sent(
    send_document_for_signing, document
):
    for signer in document.signers:
        signer["status"] = "registered"

    send_document_for_signing.return_value = {"message": "Success"}

    control = d4sign_send_document_for_signing_controller(
        user=document.user, document_instance=document
    )
    assert control["status_code"] == 200
    assert control["data"]["sent_emails"] == ["0@mail.com", "1@mail.com"]


# Test d4sign_upload_and_send_document_for_signing_controller
@patch("app.d4sign.controllers.RemoteDocument.download_docx_from_documents")
@patch("app.d4sign.controllers.D4SignAPI.upload_document_file")
@patch("app.d4sign.controllers.D4SignAPI.register_document_webhook")
@patch("app.d4sign.controllers.D4SignAPI.register_document_signer")
@patch("app.d4sign.controllers.D4SignAPI.send_document_for_signing")
def test_d4sign_upload_and_send_document_for_signing_controller(
    send_document_for_signing,
    register_document_signer,
    register_document_webhook,
    upload_document_file,
    download_docx_from_documents,
    document,
):

    download_docx_from_documents.return_value = None
    upload_document_file.return_value = {"uuid": "a1-b2-c3"}
    register_document_webhook.return_value = {
        "message": "Success",
        "document_webhook_url": "https://webhook.com/",
    }
    register_document_signer.return_value = {"message": [{"success": "1"}]}
    send_document_for_signing.return_value = {"message": "Success"}

    document.d4sign_document_uuid = None

    document_instance, control = d4sign_upload_and_send_document_for_signing_controller(
        user=document.user, document_id=document.id
    )
    assert control["status_code"] == 200
    assert control["data"]["sent_emails"] == ["0@mail.com", "1@mail.com"]
    assert document.d4sign_document_uuid is not None
    assert document_instance is not None
    assert document_instance.sent
    for signer in document_instance.signers:
        assert signer["status"] == "sent"


def test_d4sign_upload_and_send_document_for_signing_controller_document_not_found(
    document,
):
    document.d4sign_document_uuid = None
    control = d4sign_upload_and_send_document_for_signing_controller(
        user=document.user, document_id=document.id + 1
    )
    assert control["status_code"] == 404
    assert document.d4sign_document_uuid is None


def test_d4sign_upload_and_send_document_for_signing_prohibited_user(document):
    document.d4sign_document_uuid = None
    other_user = factories.UserFactory()

    control = d4sign_upload_and_send_document_for_signing_controller(
        user=other_user, document_id=document.id
    )
    assert control["status_code"] == 403
    assert document.d4sign_document_uuid is None


def test_d4sign_upload_and_send_document_for_signing_controller_invalid_signatures_provider(
    document,
):
    document.d4sign_document_uuid = None
    document.company.signatures_provider = "docusign"

    control = d4sign_upload_and_send_document_for_signing_controller(
        user=document.user, document_id=document.id
    )
    assert control["status_code"] == 451
    assert document.d4sign_document_uuid is None


# Test d4sign_document_webhook_controller
def test_d4sign_document_webhook_controller_finished(document):
    type_post = "1"
    d4sign_document_webhook_controller(document=document, type_post=type_post)
    assert document.signed
    assert document.data_assinatura == date.today()


def test_d4sign_document_webhook_controller_email_not_sent(document):
    document.signers[0]["status"] = "registered"
    document.signers[1]["status"] = "sent"

    type_post = "2"
    d4sign_document_webhook_controller(
        document=document, type_post=type_post, signer_email="0@mail.com"
    )
    assert document.signers[0]["status"] == "registered"
    assert document.signers[0]["signing_date"] == ""
    assert document.signers[1]["status"] == "sent"


def test_d4sign_document_webhook_controller_cancelled(document):
    type_post = "3"
    d4sign_document_webhook_controller(
        document=document,
        type_post=type_post,
    )
    for signer in document.signers:
        assert signer["status"] == ""
        assert signer["signing_date"] == ""


def test_d4sign_document_webhook_controller_signed(document):
    for signer in document.signers:
        signer["status"] = "sent"

    type_post = "4"
    d4sign_document_webhook_controller(
        document=document, type_post=type_post, signer_email="1@mail.com"
    )
    assert document.signers[0]["status"] == "sent"
    assert document.signers[0]["signing_date"] == ""
    assert document.signers[1]["status"] == "Completed"
    assert document.signers[1]["signing_date"] != ""
