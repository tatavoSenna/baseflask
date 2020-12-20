import pytest
from app.test import factories
from unittest.mock import patch

from app.docusign.controllers import(
    sign_document_controller, update_signer_status, update_envelope_status
)
from app.documents.controllers import(
    get_document_controller)


@patch('docusign_esign.EnvelopesApi.create_envelope')
def test_sign_document(create_envelope_mock):

    company = factories.CompanyFactory(id=134)
    user = factories.UserFactory(id=115, company=company)
    signers = [
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
        },
        {
            "title": "Empresa Contratada",
            "fields": [
                {
                    "label": "",
                    "variable": "CONTRATADA_ASSINANTE_NOME",
                    "type": "text",
                                "value": "Nome"
                },
                {
                    "label": "",
                    "variable": "CONTRATADA_ASSINANTE_EMAIL",
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
    variables = {"CONTRATANTE_ASSINANTE_1_NOME": "Luiz Senna",
                 "CONTRATANTE_ASSINANTE_1_EMAIL": "luiz.senna@parafernalia.net.br",
                 "CONTRATADA_ASSINANTE_NOME": "Carlos SIlva",
                 "CONTRATADA_ASSINANTE_EMAIL": "carlos@empresa.com"
                 }

    document = factories.DocumentFactory(
        company=company,
        user=user,
        title="teste",
        signers=signers,
        variables=variables
    )
    document_text = bytearray("Texto de teste", 'utf-8')
    account_ID = '12345'
    token = 'kasdhuwai214'

    sign_document_controller(document, document_text, account_ID, token)
    create_envelope_mock.assert_called_once()
    assert document.sent == True


def test_update_signer_and_envelope_status():
    email = 'teste@gmail.com'
    document_id = 15
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
    variables = {"CONTRATANTE_RAZAO_SOCIAL": "sdjiaowaowj",
                 "CONTRATANTE_ASSINANTE_1_EMAIL": "teste@gmail.com"
                 }
    document = factories.DocumentFactory(
        id=document_id, signers=signers_empty, variables=variables, envelope='12', signed=None)
    update_signer_status(docusign_id='12', email=email,status='Completed')
    update_envelope_status(docusign_id='12')
    retrieved_document = get_document_controller(document_id)
    retrieved_variables = retrieved_document.variables
    assert retrieved_document.signed == True
    for signer_info in retrieved_document.signers:
        for signer_field in signer_info['fields']:
            if signer_field['value'] == "Email" and retrieved_variables[signer_field['variable']] == email:
                assert signer_info['signing_date'] != ""
