import json
import logging
from app import db
from unittest.mock import MagicMock
from flask import request, Blueprint, abort, jsonify, current_app
import base64
from docusign_esign import (
    ApiClient,
    EnvelopesApi,
    EnvelopeDefinition,
    Signer,
    SignHere,
    Tabs,
    Recipients,
    Document as DocusignDocument,
)
from app.documents.remote import RemoteDocument
from app.docusign.serializers import EnvelopeSerializer


def sign_document_controller(current_document, document_text, account_ID, token):
    signers_data = []

    for signer_info in current_document.signers:
        for signer_field in signer_info['fields']:
            if signer_field['value'] == "Nome":
                name = signer_field['variable']
            if signer_field['value'] == "Email":
                email = signer_field['variable']
        signers_data.append({
            'name': current_document.variables[name],
            'email': current_document.variables[email],
            'signatures': signer_info['anchor']
        })

    if len(signers_data) > 0:

        # create the DocuSign document object
        document = DocusignDocument(
            document_base64=base64_document,
            name=current_document.title,
            file_extension='html',
            document_id=1
        )

        signers = []
        for index, signer_data in enumerate(signers_data):
            # Create the signer recipient model

            signer = Signer(  # The signer
                email=signer_data['email'], name=signer_data['name'], recipient_id=str(index + 1), routing_order="1")

            # Create a sign_here tab on the document, either relative to an anchor string or to the document page
            for signature in signer_data['signatures']:
                if signature.get('anchor_string', None):
                    sign_here = SignHere(
                        recipient_id='1', tab_label='assine aqui',
                        anchor_string=signature['anchor_string'],
                        anchor_x_offset=signature['anchor_x_offset'],
                        anchor_y_offset=signature['anchor_y_offset'],
                        anchor_ignore_if_not_present="false",
                        anchor_units="inches"
                    )
                else:
                    sign_here = SignHere(
                        recipient_id='1',
                        document_id=1,
                        tab_label='assine aqui',
                        x_position=signature['x_position'],
                        y_position=signature['y_position'],
                        page_number=signature['page_number']
                    )

            # Add the tabs model (including the sign_here tab) to the signer
            # The Tabs object wants arrays of the different field/tab types
            signer.tabs = Tabs(sign_here_tabs=[sign_here])

            signers.append(signer)

        # Next, create the top level envelope definition and populate it.
        envelope_definition = EnvelopeDefinition(
            email_subject=current_document.title,
            # The order in the docs array determines the order in the envelope
            documents=[document],
            # The Recipients object wants arrays for each recipient type
            recipients=Recipients(signers=signers),
            status="sent"  # requests that the envelope be created and sent.
        )

        # Ready to go: send the envelope request
        api_client = ApiClient()
        api_client.host = 'https://demo.docusign.net/restapi'

        api_client.set_default_header(
            "Authorization",
            "Bearer " + token
        )

        envelope_api = EnvelopesApi(api_client)
        try:
            envelope = envelope_api.create_envelope(
                account_ID, envelope_definition=envelope_definition)
        except Exception as e:
            logging.error(e)
            return jsonify({'message': 'Error accessing docusign api.'}), 400

        # save envelope data on document, if its not a Mock object type(for test purposes)
        current_document.sent = True
        if not isinstance(envelope, MagicMock):
            current_document.envelope = json.dumps(
                EnvelopeSerializer().dump(envelope))
            # testar para ver se o commit está atualizando o json corretamente
            db.session.commit()

        # envelop_summary_2 = envelope_api.get_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_summary.envelope_id)
