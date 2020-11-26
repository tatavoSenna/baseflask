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
    signers = [{"CONTRATANTE": [{
        "id": 1,
        "name": "Bruno",
        "email": "bruno@parafernalia.net.br",
        "signatures": [{"anchor_string": "CONTRATANTE", "name_variable": "concessionaries", "anchor_x_offset": "-0.5", "anchor_y_offset": "-0.4"}
                       ]
    }]
    },
        {"CONTRATADO": [
            {
                "id": 2,
                "name": "Luiz",
                "email": "luiz@parafernalia.net.br",
                "signatures": [{"anchor_string": "CONTRATANTE", "name_variable": "concessionaries", "anchor_x_offset": "-0.5", "anchor_y_offset": "-0.4"}
                               ]
            }]
         }]
    document = factories.DocumentFactory(
        company=company,
        user=user,
        title="teste",
        signers=signers
    )
    document_text = bytearray("Texto de teste", 'utf-8')
    account_ID = '12345'
    token = 'kasdhuwai214'

    sign_document_controller(document, document_text, account_ID, token)
    create_envelope_mock.assert_called_once()
