import pytest
from app.test import factories
from flask import jsonify
from unittest.mock import patch
from datetime import datetime

from app.models.documents import Document, DocumentTemplate
from app.documents.controllers import(
    get_document_controller,
    create_document_controller,
    create_new_version_controller,
    save_signers_controller,
    download_document_text_controller,
    upload_document_text_controller,
    next_status_controller,
    previous_status_controller,
    document_creation_email_controller
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
    versions = [{"description": "Version 0",
                 "email": "teste@gmail.com",
                 "created_at": "2020-10-3 21: 00: 00",
                 "id": "0"
                 }]
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
    document = factories.DocumentFactory(
        company=company, user=user, workflow=workflow)
    query = (
        Document.query.filter_by(company_id=company_id).first()
    )
    test_info = DocumentListSerializer(many=False).dump(query)
    assert test_info["user"]["name"] == "Pedro"
    assert test_info["user"]["surname"] == "Costa"
    assert test_info["user"]["email"] == "testemail@gmail.com"
    assert test_info["status"] == "Passo atual"


def test_update_document_signers():
    document_id = 134
    signers_empty = [
        {
            "title": "Empresa Contratante Representante 1",
            "fields": [
                {
                    "label": "",
                    "variable": "CONTRATANTE_ASSINANTE_1_NOME",
                    "type": "text",
                                "value": "Nome"
                },
                {
                    "label": "",
                    "variable": "CONTRATANTE_ASSINANTE_1_EMAIL",
                    "type": "email",
                                "value": "Email"
                }
            ],
            "anchor": [
                {
                    "anchor_string": "CONTRATANTE",
                    "name_variable": "concessionaries",
                    "anchor_x_offset": "-0.5",
                    "anchor_y_offset": "-0.4"
                }
            ]
        }
    ]

    signers_info = {"CONTRATANTE_ASSINANTE_1_NOME": "Luiz Senna",
                    "CONTRATANTE_ASSINANTE_1_EMAIL": "luiz.senna@parafernalia.net.br"
                    }
    variables = {"CONTRATANTE_RAZAO_SOCIAL": "sdjiaowaowj"}
    document = factories.DocumentFactory(
        id=document_id, signers=signers_empty, variables=variables)
    retrieved_document = save_signers_controller(document_id, signers_info)

    assert retrieved_document.variables['CONTRATANTE_ASSINANTE_1_NOME'] == "Luiz Senna"
    assert retrieved_document.variables['CONTRATANTE_ASSINANTE_1_EMAIL'] == "luiz.senna@parafernalia.net.br"


@ patch('app.documents.controllers.RemoteDocument.create')
def test_create_document(create_remote_document_mock):
    company = factories.CompanyFactory()
    user = factories.UserFactory(
        company=company, email="testemail@gmail.com"
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
        user.email,
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


@ patch('app.documents.controllers.send_email_controller')
def test_email_create_document(send_email_on_document_creation_mock):
    company_id = 134
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(
        company=company, email="testemail@gmail.com"
    )
    user2 = factories.UserFactory(
        company=company, email="testemail2@gmail.com"
    )
    email_title = 'teste'

    email_list = []
    email_list.append(user.email)
    email_list.append(user2.email)

    document_creation_email_controller(
        email_title, company_id, user.email)

    send_email_on_document_creation_mock.assert_called_once_with(
        user.email, email_list, 'New Document created', email_title
    )


def test_create_new_document_version():
    company_id = 134
    user_id = 115
    user_email = "teste@gmail.com"
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    versions = [{"description": "Version 0",
                 "email": "aaa@gmail.com",
                 "created_at": current_date,
                 "id": "0"
                 }]

    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, email=user_email, company=company)
    document = factories.DocumentFactory(
        company=company,
        user=user,
        versions=versions,
    )

    create_new_version_controller(document.id, "teste", user.email)
    retrieved_document = get_document_controller(document.id)
    new_version = retrieved_document.versions[0]

    assert new_version["description"] == "teste"
    assert new_version["email"] == user_email
    assert new_version["created_at"] == current_date
    assert new_version["id"] == "1"


@ patch('app.documents.controllers.RemoteDocument.download_text_from_documents')
def test_download_document_text(download_document_text_mock):
    versions = [{"description": "Version 0",
                 "email": "aaa@gmail.com",
                 "created_at": "test",
                 "id": "0"
                 }]
    document = factories.DocumentFactory(id=1, versions=versions)
    version_id = document.versions[0]["id"]

    textfile = download_document_text_controller(document.id, version_id)
    download_document_text_mock.assert_called_once_with(
        document, version_id
    )


@ patch('app.documents.controllers.RemoteDocument.upload_filled_text_to_documents')
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
    versions = [{"description": "Version 0",
                 "user": user_id,
                 "created_at": "2020-10-3 21: 00: 00",
                 "id": "0"
                 }]
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
    versions = [{"description": "Version 0",
                 "email": "teste@gmail.com",
                 "created_at": "2020-10-3 21: 00: 00",
                 "id": "0"
                 }]
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
