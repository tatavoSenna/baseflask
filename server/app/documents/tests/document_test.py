import pytest
from app.test import factories
from flask import jsonify
from unittest.mock import patch

from app.models.documents import Document, DocumentTemplate
from app.documents.controllers import(
    get_document_controller,
    create_document_controller,
    download_document_text_controller,
    upload_document_text_controller,
    next_status_controller,
    previous_status_controller
)
from app.serializers.document_serializers import (
    DocumentListSerializer
)


def test_retrieve_document():
    company_id = 134
    user_id = 115
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    document = factories.DocumentFactory(company=company, user=user)
    retrieved_document = get_document_controller(document.id)
    assert retrieved_document.company_id == company_id
    assert retrieved_document.user_id == user_id


def test_retrieve_document_jsonb_fields():
    company_id = 134
    user_id = 115
    workflow = [{"workflow": "step 1 step 2"}]
    variables = [{"variable1": 5121}]
    versions = [{"current_version": 1219}]
    signers = [{"name": "Joelma"}]
    current_step = "primeiro"

    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    document = factories.DocumentFactory(
        company=company,
        user=user,
        workflow=workflow,
        variables=variables,
        versions=versions,
        signers=signers,
        current_step=current_step
    )
    retrieved_document = get_document_controller(document.id)

    assert retrieved_document.workflow == workflow
    assert retrieved_document.variables == variables
    assert retrieved_document.versions == versions
    assert retrieved_document.signers == signers
    assert retrieved_document.current_step == current_step


def test_document_list_serializer():
    company_id = 134
    user_id = 115
    workflow = {
        "nodes": {
            "544": {
                "next_node": "5521",
            },
            "3485": {
                "next_node": None,
            },
            "5521": {
                "next_node": "3485",
                "title": "Passo atual"
            }
        },
        "current_node": "5521"
    }
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(
        id=user_id, name='Pedro', surname='Costa', email='testemail@gmail.com', company=company)
    document = factories.DocumentFactory(company=company, user=user, workflow=workflow)
    query = (
        Document.query.filter_by(company_id=company_id).first()
    )
    test_info = DocumentListSerializer(many=False).dump(query)
    assert test_info["user"]["name"] == "Pedro"
    assert test_info["user"]["surname"] == "Costa"
    assert test_info["user"]["email"] == "testemail@gmail.com"
    assert test_info["status"] == "Passo atual"


@patch('app.documents.controllers.RemoteDocument.create')
def test_create_document(create_remote_document_mock):
    company = factories.CompanyFactory()
    user = factories.UserFactory(
        company=company
    )
    document_template = factories.DocumentTemplateFactory(
        company=company
    )
    title = "default title"

    variables = {}

    assert DocumentTemplate.query.get(
        document_template.id).company_id == company.id

    document = create_document_controller(
        user.id,
        user.company_id,
        variables,
        document_template.id,
        title
    )

    assert document.user_id == user.id
    assert document.company_id == company.id
    assert document.document_template_id == document_template.id
    assert document.title == title

    create_remote_document_mock.assert_called_once_with(
        document
    )


@patch('app.documents.controllers.RemoteDocument.download_text_from_documents')
def test_download_document_text(download_document_text_mock):

    document = factories.DocumentFactory(id=1)

    textfile = download_document_text_controller(document.id)
    download_document_text_mock.assert_called_once_with(
        document
    )


@patch('app.documents.controllers.RemoteDocument.upload_filled_text_to_documents')
def test_upload_document_text(upload_document_text_mock):

    document = factories.DocumentFactory(id=1)

    document_text = "test text"
    upload_document_text_controller(document.id, document_text)
    upload_document_text_mock.assert_called_once_with(
        document,
        bytearray(document_text, encoding='utf8')
    )


def test_change_document_status_next():
    company_id = 134
    user_id = 115
    workflow = {
        "nodes": {
            "544": {
                "next_node": "5521",
            },
            "3485": {
                "next_node": None,
            },
            "5521": {
                "next_node": "3485",
            }
        },
        "current_node": "5521"
    }

    variables = [{"variable1": 5121}]
    versions = [{"current_version": 1219}]
    signers = [{"name": "Joelma"}]
    current_step = "primeiro"

    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    document = factories.DocumentFactory(
        company=company,
        user=user,
        workflow=workflow,
        variables=variables,
        versions=versions,
        signers=signers,
        current_step=current_step
    )
    # call the controller to change status from '5521' to '3485'
    retrieved_document, status = next_status_controller(document.id)
    # check if status was changed to the expected one
    assert retrieved_document.workflow["current_node"] == "3485"


def test_change_document_status_previous():
    company_id = 134
    user_id = 115
    workflow = {
        "nodes": {
            "544": {
                "next_node": "5521",
            },
            "3485": {
                "next_node": None,
            },
            "5521": {
                "next_node": "3485",
            }
        },
        "current_node": "5521"
    }

    variables = [{"variable1": 5121}]
    versions = [{"current_version": 1219}]
    signers = [{"name": "Joelma"}]
    current_step = "primeiro"

    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    document = factories.DocumentFactory(
        company=company,
        user=user,
        workflow=workflow,
        variables=variables,
        versions=versions,
        signers=signers,
        current_step=current_step
    )
    # call the controller to change status from '5521' to '544'
    retrieved_document, status = previous_status_controller(document.id)
    # check if status was changed to the expected one
    assert retrieved_document.workflow["current_node"] == "544"
