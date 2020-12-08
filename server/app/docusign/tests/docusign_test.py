import pytest
from app.test import factories
from unittest.mock import patch

from app.docusign.controllers import(
    sign_document_controller
)


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
