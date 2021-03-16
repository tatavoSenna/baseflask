import pytest
from app.test import factories
from unittest.mock import patch
from app.models.documents import ExternalToken
from app.external.controllers import(
    generate_external_token_controller,
    authorize_external_token_controller,
    create_external_document_controller
)


def test_generate_token():
    template_id = 155
    user_id = 222
    company_id = 655
    document_template = factories.DocumentTemplateFactory(id=template_id)
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    test_token = generate_external_token_controller(
        template_id, "documento novo", user_id)
    retrieved_token = ExternalToken.query.filter_by(
        token=str(test_token)).first()

    assert retrieved_token.document_template_id == template_id
    assert retrieved_token.token == str(test_token)
    assert retrieved_token.user_id == 222
    assert retrieved_token.title == "documento novo"


def test_authorize_token():
    template_id = 167
    user_id = 226
    company_id = 601
    document_template = factories.DocumentTemplateFactory(id=template_id)
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    test_token = generate_external_token_controller(
        template_id, "novo documento", user_id)
    template_response = authorize_external_token_controller(
        test_token)
    assert template_response == template_id


@ patch('app.documents.controllers.RemoteDocument.create')
def test_create_external_document(create_remote_document_mock):
    user_id = 111
    company_id = 444
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(
        id=user_id, company=company, email="testemail@gmail.com"
    )

    workflow = {
        "nodes": {
            "544": {
                "next_node": "5521",
                "changed_by": ""
            },
            "3485": {
                "next_node": None,
                "changed_by": ""
            },
            "5521": {
                "next_node": "3485",
                "changed_by": ""
            }
        },
        "current_node": "544",
        "created_by": ""
    }

    document_template = factories.DocumentTemplateFactory(
        company=company, workflow=workflow
    )
    title = "default title"

    variables = {}
    test_token = generate_external_token_controller(
        document_template.id, title, user_id)

    document = create_external_document_controller(
        variables,
        document_template.id,
        test_token
    )
    assert document.user_id == user.id
    assert document.company_id == company.id
    assert document.document_template_id == document_template.id
    assert document.title == title
    assert document.workflow['created_by'] == "External User"

    create_remote_document_mock.assert_called_once_with(
        document, document_template, 444
    )
