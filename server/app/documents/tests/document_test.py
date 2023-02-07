import pytest
import json
from app.test import factories
from flask import jsonify
from unittest.mock import patch
from datetime import datetime, timedelta
from datetime import date

from app.models.documents import Document, DocumentTemplate
from app.documents.controllers import (
    get_document_controller,
    create_new_version_controller,
    save_signers_controller,
    download_document_text_controller,
    upload_document_text_controller,
    next_status_controller,
    previous_status_controller,
    workflow_status_change_email_controller,
    get_download_url_controller,
    fill_signing_date_controller,
    delete_document_controller,
    get_pdf_download_url_controller,
    change_variables_controller,
    edit_document_workflow_controller,
)
from app.serializers.document_serializers import DocumentListSerializer
from app.serializers.document_serializers import DocumentListSerializer
from app.serializers.document_serializers import DocumentListSerializer


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
    versions = [
        {
            "description": "Version 0",
            "email": "teste@gmail.com",
            "created_at": "2020-10-3 21: 00: 00",
            "id": "0",
        }
    ]
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
        current_step=current_step,
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
            "5521": {"next_node": "3485", "title": "Passo atual"},
        },
        "current_node": "5521",
    }
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(
        id=user_id, name="Pedro", email="testemail@gmail.com", company=company
    )
    document = factories.DocumentFactory(company=company, user=user, workflow=workflow)
    query = Document.query.filter_by(company_id=company_id).first()
    test_info = DocumentListSerializer(many=False).dump(query)
    assert test_info["user"]["name"] == "Pedro"
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
                    "value": "Nome",
                },
                {
                    "label": "",
                    "variable": "CONTRATANTE_ASSINANTE_1_EMAIL",
                    "type": "email",
                    "value": "Email",
                },
            ],
            "anchor": [
                {
                    "anchor_string": "CONTRATANTE",
                    "name_variable": "concessionaries",
                    "anchor_x_offset": "-0.5",
                    "anchor_y_offset": "-0.4",
                }
            ],
        }
    ]

    signers_info = {
        "CONTRATANTE_ASSINANTE_1_NOME": "Luiz Senna",
        "CONTRATANTE_ASSINANTE_1_EMAIL": "luiz.senna@parafernalia.net.br",
    }
    variables = {"CONTRATANTE_RAZAO_SOCIAL": "sdjiaowaowj"}
    document = factories.DocumentFactory(
        id=document_id, signers=signers_empty, variables=variables
    )
    retrieved_document = save_signers_controller(document_id, signers_info)

    assert retrieved_document.variables["CONTRATANTE_ASSINANTE_1_NOME"] == "Luiz Senna"
    assert (
        retrieved_document.variables["CONTRATANTE_ASSINANTE_1_EMAIL"]
        == "luiz.senna@parafernalia.net.br"
    )


@patch("app.documents.controllers.send_email_controller")
def test_email_change_document_workflow_status(status_change_email_mock):
    document_id = 72
    group1 = factories.GroupFactory(id=15)
    group2 = factories.GroupFactory(id=18)
    user1 = factories.UserFactory(id=32, email="teste1@gmail.com")
    user2 = factories.UserFactory(id=34, email="teste2@gmail.com")
    user3 = factories.UserFactory(id=36, email="teste3@gmail.com")
    workflow = {
        "nodes": {
            "544": {
                "next_node": "5521",
                "responsible_group": "1",
                "responsible_users": "32",
                "title": "Teste titulo",
            },
            "3485": {
                "next_node": None,
                "responsible_group": "1",
                "responsible_users": "32",
                "title": "Teste titulo 2",
            },
            "5521": {
                "next_node": "3485",
                "responsible_group": "15",
                "responsible_users": [32],
                "title": "Análise Diretoria",
            },
        },
        "current_node": "5521",
    }

    sender_email = "app@lawing.com.br"
    status = "Análise Diretoria"
    title = "Documento de teste"

    email_list = []
    email_list.append("teste1@gmail.com")

    document = factories.DocumentFactory(id=document_id, workflow=workflow, title=title)

    participant1 = factories.ParticipatesOnFactory(group=group1, user=user1)
    participant2 = factories.ParticipatesOnFactory(group=group2, user=user1)
    participant3 = factories.ParticipatesOnFactory(group=group2, user=user2)
    participant4 = factories.ParticipatesOnFactory(group=group2, user=user3)

    workflow_status_change_email_controller(document_id, title)

    status_change_email_mock.assert_called_once_with(
        "app@lawing.com.br",
        email_list,
        f"O Documento {title} mudou para o status {status}.",
        title,
        "d-d869f27633274db3810abaa3b60f1833",
    )


def test_create_new_document_version():
    company_id = 134
    user_id = 115
    user_email = "teste@gmail.com"
    current_date = datetime.now().astimezone().replace(microsecond=0).isoformat()
    versions = [
        {
            "description": "Version 0",
            "email": "aaa@gmail.com",
            "created_at": current_date,
            "id": "0",
            "comments": None,
        }
    ]

    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, email=user_email, company=company)
    document = factories.DocumentFactory(
        company=company,
        user=user,
        versions=versions,
    )

    create_new_version_controller(document.id, "teste", user.email, "New comment")
    retrieved_document = get_document_controller(document.id)
    new_version = retrieved_document.versions[0]

    assert new_version["description"] == "teste"
    assert new_version["email"] == user_email
    assert new_version["created_at"] == current_date
    assert new_version["id"] == "1"
    assert new_version["comments"] == "New comment"


@patch("app.documents.controllers.RemoteDocument.download_text_from_documents")
def test_download_document_text(download_document_text_mock):
    versions = [
        {
            "description": "Version 0",
            "email": "aaa@gmail.com",
            "created_at": "test",
            "id": "0",
        }
    ]
    document = factories.DocumentFactory(id=1, versions=versions)
    version_id = document.versions[0]["id"]

    textfile = download_document_text_controller(document.id, version_id)
    download_document_text_mock.assert_called_once_with(document, version_id)


@patch("app.documents.controllers.RemoteDocument.upload_filled_text_to_documents")
def test_upload_document_text(upload_document_text_mock):
    document = factories.DocumentFactory(id=1)

    document_text = "test text"
    upload_document_text_controller(document.id, document_text)
    upload_document_text_mock.assert_called_once_with(
        document, bytearray(document_text, encoding="utf8")
    )


def test_change_document_status_next():
    company_id = 134
    user_id = 115
    workflow = {
        "nodes": {
            "544": {"next_node": "5521", "changed_by": "", "title": "step1"},
            "3485": {
                "next_node": None,
                "changed_by": "",
                "title": "step3",
                "deadline": 1,
            },
            "5521": {"next_node": "3485", "changed_by": "", "title": "step2"},
        },
        "current_node": "5521",
    }

    variables = [{"variable1": 5121}]
    versions = [
        {
            "description": "Version 0",
            "user": user_id,
            "created_at": "2020-10-3 21: 00: 00",
            "id": "0",
        }
    ]
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
        current_step=current_step,
    )
    # call the controller to change status from '5521' to '3485'
    retrieved_document, status = next_status_controller(document.id, "joao")
    # check if status was changed to the expected one
    assert retrieved_document.workflow["current_node"] == "3485"
    assert retrieved_document.workflow["nodes"]["5521"]["changed_by"] == "joao"
    assert retrieved_document.current_step == "step3"
    assert (
        datetime.strptime(
            retrieved_document.workflow["nodes"]["3485"]["due_date"],
            "%Y-%m-%dT%H:%M:%S",
        ).day
        == (datetime.today() + timedelta(days=1)).day
    )
    assert retrieved_document.due_date.day == (datetime.today() + timedelta(days=1)).day


def test_change_document_status_previous():
    company_id = 134
    user_id = 115
    workflow = {
        "nodes": {
            "544": {
                "next_node": "5521",
                "changed_by": "",
                "title": "step1",
                "deadline": 1,
            },
            "3485": {"next_node": None, "changed_by": "", "title": "step3"},
            "5521": {"next_node": "3485", "changed_by": "", "title": "step2"},
        },
        "current_node": "5521",
    }

    variables = [{"variable1": 5121}]
    versions = [
        {
            "description": "Version 0",
            "email": "teste@gmail.com",
            "created_at": "2020-10-3 21: 00: 00",
            "id": "0",
        }
    ]
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
        current_step=current_step,
    )
    # call the controller to change status from '5521' to '544'
    retrieved_document, status = previous_status_controller(document.id)
    # check if status was changed to the expected one
    assert retrieved_document.workflow["current_node"] == "544"
    assert retrieved_document.current_step == "step1"
    assert (
        datetime.strptime(
            retrieved_document.workflow["nodes"]["544"]["due_date"],
            "%Y-%m-%dT%H:%M:%S",
        ).day
        == (datetime.today() + timedelta(days=1)).day
    )
    assert retrieved_document.due_date.day == (datetime.today() + timedelta(days=1)).day


@patch("app.documents.controllers.RemoteDocument.download_signed_document")
def test_download_signed_document(download_document_mock):
    document_id = 72
    document = factories.DocumentFactory(id=document_id)

    url = get_download_url_controller(document)

    download_document_mock.assert_called_once_with(document)


@patch("app.documents.controllers.RemoteDocument.download_pdf_document")
def test_download_pdf_document(download_pdf_mock):
    document_id = 77
    document = factories.DocumentFactory(id=document_id)

    url = get_pdf_download_url_controller(document, 0)

    download_pdf_mock.assert_called_once_with(document, 0)


@patch("app.documents.controllers.fill_text_with_variables")
def test_fill_signing_date(fill_signing_date_mock):
    company_id = 144
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(company=company)
    doc_variables = {"RANDOM_INFO": "info"}
    document = factories.DocumentFactory(
        company=company, user=user, variables=doc_variables, text_type=".txt"
    )
    text = "texto qualquer"
    date_today = date.today()
    signing_date = json.dumps(date.today().strftime("%d/%m/%Y"), default=str).replace(
        '"', " "
    )
    variable = {"CURRENT_DATE": signing_date}

    fill_signing_date_controller(document, text)
    fill_signing_date_mock.assert_called_once_with(text, variable)
    assert document.variables["SIGN_DATE"] == signing_date


def test_delete_document():
    document = factories.DocumentFactory(id=73, signed=True)
    ret_document = get_document_controller(document.id)
    delete_document_controller(ret_document)

    assert get_document_controller(73).deleted == True
    assert get_document_controller(73).deleted_at != None


@patch("app.documents.controllers.update_variables")
def test_change_document_variables(update_variables_mock):
    company = factories.CompanyFactory(id=17)
    user = factories.UserFactory(company=company, email="testemail@gmail.com")

    workflow = {
        "nodes": {
            "544": {"next_node": "5521", "changed_by": ""},
            "3485": {"next_node": None, "changed_by": ""},
            "5521": {"next_node": "3485", "changed_by": ""},
        },
        "current_node": "544",
        "created_by": "",
    }

    versions = [
        {
            "description": "Version 0",
            "email": "teste@gmail.com",
            "created_at": "2020-10-3 21: 00: 00",
            "id": "0",
        }
    ]

    document_template_docx = factories.DocumentTemplateFactory(
        id=66, company=company, company_id=17, workflow=workflow, text_type=".docx"
    )
    variables = {"variable_teste": "aaa"}
    document = factories.DocumentFactory(
        id=333,
        company=company,
        document_template_id=66,
        user_id=user.id,
        variables=variables,
        versions=versions,
        draft=False,
        text_type=".docx",
    )

    new_variables = {"variable_teste": "bbb"}
    change_variables_controller(
        document, new_variables, "testemail@gmail.com", variables
    )
    update_variables_mock.assert_called_with(
        document, document_template_docx, 17, new_variables
    )

    document = Document.query.filter_by(id=333).first()
    assert document.variables == variables
    assert document.versions[0]["id"] == "1"


def test_edit_document_workflow_controller():
    document = factories.DocumentFactory()

    user1 = factories.UserFactory()
    user2 = factories.UserFactory()
    user3 = factories.UserFactory()
    group1 = factories.GroupFactory()
    group2 = factories.GroupFactory()
    group3 = factories.GroupFactory()
    factories.ParticipatesOnFactory(group=group1, user=user1)
    factories.ParticipatesOnFactory(group=group2, user=user2)
    factories.ParticipatesOnFactory(group=group3, user=user3)

    current_step = "3485"
    workflow = {
        "current_node": current_step,
        "nodes": {
            "544": {
                "next_node": current_step,
                "due_date": "2021-09-20T11:35:38.387630",
                "responsible_users": [
                    {"id": user1.id, "email": user1.email, "name": user1.name},
                ],
                "responsible_group": {"id": group1.id, "name": group1.name},
            },
            current_step: {
                "next_node": None,
                "due_date": "2021-09-20T11:35:38.387630",
                "responsible_users": [
                    {"id": user2.id, "email": user2.email, "name": user2.name}
                ],
                "responsible_group": {"id": group2.id, "name": group2.name},
            },
        },
    }

    document.workflow = workflow
    document.current_step = current_step

    new_group = {"id": group3.id, "name": group3.name}
    new_responsible_users = [{"id": user3.id, "email": user3.email, "name": user3.name}]
    new_due_date = "2021-09-20"

    document = edit_document_workflow_controller(
        document,
        new_group=new_group,
        new_responsible_users=new_responsible_users,
        new_due_date=new_due_date,
    )

    assert (
        document.workflow["nodes"][current_step]["responsible_users"]
        == new_responsible_users
    )
    assert document.workflow["nodes"][current_step]["responsible_group"] == new_group
    assert document.workflow["nodes"][current_step]["due_date"] == new_due_date
    assert document.due_date == datetime.fromisoformat(new_due_date)
