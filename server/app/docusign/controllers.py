import json
import copy
import logging
import base64
from app import db
from unittest.mock import MagicMock
from datetime import datetime
from flask import request, Blueprint, abort, jsonify, current_app
from app.models.documents import Document
from docusign_esign import (
    ApiClient,
    EnvelopesApi,
    Envelope,
    EnvelopeDefinition,
    Signer,
    SignHere,
    Tabs,
    Recipients,
    Document as DocusignDocument,
)
from app.models.documents import Document
from flask import request, Blueprint, abort, jsonify, current_app
from app.documents.remote import RemoteDocument
from datetime import datetime
from unittest.mock import MagicMock
from app import db
import logging
import json
import copy
import base64


event_notification = {
    "loggingEnabled": "true",  # The api wants strings for true/false
    "requireAcknowledgment": "true",
    "useSoapInterface": "false",
    "includeCertificateWithSoap": "false",
    "signMessageWithX509Cert": "false",
    "includeDocuments": "true",
    "includeEnvelopeVoidReason": "true",
    "includeTimeZone": "true",
    "includeSenderAccountAsCustomField": "true",
    "includeDocumentFields": "true",
    "includeCertificateOfCompletion": "true",
    "envelopeEvents": [  # for this recipe, we're requesting notifications
        # for all envelope and recipient events
        {"envelopeEventStatusCode": "sent"},
        {"envelopeEventStatusCode": "delivered"},
        {"envelopeEventStatusCode": "completed"},
        {"envelopeEventStatusCode": "declined"},
        {"envelopeEventStatusCode": "voided"},
    ],
    "recipientEvents": [
        {"recipientEventStatusCode": "Sent"},
        {"recipientEventStatusCode": "Delivered"},
        {"recipientEventStatusCode": "Completed"},
        {"recipientEventStatusCode": "Declined"},
        {"recipientEventStatusCode": "AuthenticationFailed"},
        {"recipientEventStatusCode": "AutoResponded"},
    ],
}


def sign_document_controller(
    current_document, document_file, account_ID, token, username
):
    signers_data = []

    for signer_info in current_document.signers:
        for signer_field in signer_info["fields"]:
            if signer_field["value"] == "Nome":
                name = signer_field["variable"]
            if signer_field["value"] == "Email":
                email = signer_field["variable"]
        signers_data.append(
            {
                "name": current_document.variables[name],
                "email": current_document.variables[email],
                "signatures": signer_info["anchor"],
            }
        )

    if len(signers_data) > 0:

        if current_document.text_type == ".txt":
            document = DocusignDocument(
                name=current_document.title,
                document_id=1,
                file_extension="pdf",
                document_base64=base64.b64encode(document_file).decode("utf-8"),
            )

        elif current_document.text_type == ".docx":
            document = DocusignDocument(
                name=current_document.title,
                document_id=1,
                file_extension=".docx",
                document_base64=base64.b64encode(document_file.getvalue()).decode(
                    "ascii"
                ),
            )

        signers = []
        for index, signer_data in enumerate(signers_data):
            # Create the signer recipient model

            signer = Signer(  # The signer
                email=signer_data["email"],
                name=signer_data["name"],
                recipient_id=str(index + 1),
                routing_order="1",
            )

            # Create a sign_here tab on the document, either relative to an anchor string or to the document page
            for signature in signer_data["signatures"]:
                if signature.get("anchor_string", None):
                    sign_here = SignHere(
                        recipient_id="1",
                        tab_label="assine aqui",
                        anchor_string=signature["anchor_string"],
                        anchor_x_offset=signature["anchor_x_offset"],
                        anchor_y_offset=signature["anchor_y_offset"],
                        anchor_ignore_if_not_present="false",
                        anchor_units="inches",
                    )
                else:
                    sign_here = SignHere(
                        recipient_id="1",
                        document_id=1,
                        tab_label="assine aqui",
                        x_position=signature["x_position"],
                        y_position=signature["y_position"],
                        page_number=signature["page_number"],
                    )

            # Add the tabs model (including the sign_here tab) to the signer
            # The Tabs object wants arrays of the different field/tab types
            signer.tabs = Tabs(sign_here_tabs=[sign_here])

            signers.append(signer)

        # get the event notification url form the app config
        event_notification["url"] = current_app.config["DOCUSIGN_WEBHOOK_URL"]

        # Next, create the top level envelope definition and populate it.
        envelope_definition = EnvelopeDefinition(
            email_subject=current_document.title,
            # The order in the docs array determines the order in the envelope
            documents=[document],
            # The Recipients object wants arrays for each recipient type
            recipients=Recipients(signers=signers),
            event_notification=event_notification,
            status="sent",  # requests that the envelope be created and sent.
        )

        # Ready to go: send the envelope request
        api_client = ApiClient()
        api_client.host = "https://demo.docusign.net/restapi"

        api_client.set_default_header("Authorization", "Bearer " + token)

        envelope_api = EnvelopesApi(api_client)

        envelope = envelope_api.create_envelope(
            account_ID, envelope_definition=envelope_definition
        )

        # save envelope data on document
        current_document.sent = True
        current_document.envelope = envelope.envelope_id
        db.session.add(current_document)
        db.session.commit()

        # envelop_summary_2 = envelope_api.get_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_summary.envelope_id)


def update_signer_status(
    docusign_id=None, email=None, status=None, signing_time=None, timezone_offset=None
):
    document = Document.query.filter_by(envelope=docusign_id).first()

    # need to make a copy so that changes in signers JSON are tracked
    signers = copy.deepcopy(document.signers)
    variables = document.variables

    for signer_info in signers:
        for signer_field in signer_info["fields"]:
            if (signer_field["value"] == "Email") and (
                variables[signer_field["variable"]] == email
            ):
                # save status and create field if not there already
                signer_info["status"] = status
                # register the date and time of signature if it has not yet been registered
                if status == "Completed" and not signer_info.get("signing_date", ""):
                    # now convert so that it can be stored on correct format
                    if timezone_offset < 0:
                        timezone_offset = -1 * timezone_offset
                        signer_info[
                            "signing_date"
                        ] = f"{signing_time}-0{timezone_offset}:00"
                    else:
                        signer_info[
                            "signing_date"
                        ] = f"{signing_time}+0{timezone_offset}:00"
                break

    document.signers = signers
    db.session.add(document)
    db.session.commit()


def update_envelope_status(docusign_id, document_bytes):
    document = Document.query.filter_by(envelope=docusign_id).first()
    document.signed = True

    remote_document = RemoteDocument()
    remote_document.upload_signed_document(document, document_bytes)

    db.session.add(document)
    db.session.commit()


def void_envelope_controller(document, envelope_id, token, account_id):
    api_client = ApiClient()
    api_client.host = "https://demo.docusign.net/restapi"

    api_client.set_default_header("Authorization", "Bearer " + token)
    envelopes_api = EnvelopesApi(api_client)
    env = Envelope()
    env.status = "voided"
    env.voided_reason = "Envelope void was requested"
    results = envelopes_api.update(
        account_id=account_id,
        envelope_id=envelope_id,
        envelope=env,
        resend_envelope=False,
    )
    document.sent = False
    document.envelope = None
    db.session.add(document)
    db.session.commit()

    return results
