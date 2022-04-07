import io
import boto3
import requests

from datetime import date, datetime
from pdfrw import PdfReader, PdfWriter
from sqlalchemy.orm.attributes import flag_modified
from typing import Optional

from flask import current_app

from app import db
from app.models import Company, Document
from app.documents.remote import RemoteDocument

from .API.api import D4SignAPI


def d4sign_get_company_info_controller(user, company_id: int) -> dict:
    """
    Controls fetching for a company's D4Sign info from database.
    Secret credentials are ommited at response.
    return example = {
        'status_code': 200,
        'message': 'Successfully retrieved company\'s D4Sign info',
        'data': {
            'company_info': {
                'id': 1,
                'd4sign_api_token': 'a1-b2-c3',
                'd4sign_directory_structure': [
                    {'safe_name': 'Lawing Documents', 'folders': []}
                ]
            }
        }
    }
    """
    control = {"status_code": 200, "message": "", "data": {}}

    company = Company.query.get(company_id)
    if company is None:
        control["message"] = "Company not found"
        control["status_code"] = 404
        return control

    if company != user.company:
        control["message"] = "User does not belong to this company"
        control["status_code"] = 403
        return control

    d4sign_api_cryptkey = company.d4sign_api_cryptkey
    if d4sign_api_cryptkey is not None:
        d4sign_api_cryptkey = "*"

    d4sign_api_hmac_secret = company.d4sign_api_hmac_secret
    if d4sign_api_hmac_secret is not None:
        d4sign_api_hmac_secret = "*"

    company_info = {
        "id": company_id,
        "d4sign_api_token": company.d4sign_api_token,
        "d4sign_safe_name": company.d4sign_safe_name,
        "d4sign_api_cryptkey": d4sign_api_cryptkey,
        "d4sign_api_hmac_secret": d4sign_api_hmac_secret,
    }

    control["message"] = "Successfully retrieved company's D4Sign info"
    control["data"]["company_info"] = company_info

    return control


def d4sign_update_company_info_controller(
    user,
    company_id: int,
    d4sign_api_token: Optional[str] = None,
    d4sign_api_cryptkey: Optional[str] = None,
    d4sign_api_hmac_secret: Optional[str] = None,
    d4sign_safe_name: Optional[str] = None,
) -> dict:
    """
    Controls updating a company's D4Sign info from database.
    Secret credentials are ommited at response.
    return example = {
        'status_code': 200,
        'message': 'Successfully updated company\'s D4Sign info',
        'data': {
            'updated_fields': {
                'd4sign_api_token': ['<old>', '<new>']
            }
        }
    }
    """
    control = {"status_code": 200, "message": "", "data": {}}

    company = Company.query.get(company_id)
    if company is None:
        control["message"] = "Company not found"
        control["status_code"] = 404
        return control

    if company != user.company:
        control["message"] = "User does not belong to this company"
        control["status_code"] = 403
        return control

    updated_fields = {}
    updated = False

    signatures_provider = company.signatures_provider
    if signatures_provider != "d4sign":
        updated = True
        company.signatures_provider = "d4sign"
        updated_fields["signatures_provider"] = {
            "old": signatures_provider,
            "new": "d4sign",
        }

    if d4sign_api_token is not None:
        d4sign_api_token_old = company.d4sign_api_token
        if d4sign_api_token != d4sign_api_token_old:
            updated = True
            company.d4sign_api_token = d4sign_api_token
            updated_fields["d4sign_api_token"] = {
                "old": d4sign_api_token_old,
                "new": d4sign_api_token,
            }

    if d4sign_api_cryptkey is not None:
        d4sign_api_cryptkey_old = company.d4sign_api_cryptkey
        if d4sign_api_cryptkey != d4sign_api_cryptkey_old:
            updated = True
            company.d4sign_api_cryptkey = d4sign_api_cryptkey
            updated_fields["d4sign_api_cryptkey"] = {"old": None, "new": None}

    if d4sign_api_hmac_secret is not None:
        d4sign_api_hmac_secret_old = company.d4sign_api_hmac_secret
        if d4sign_api_hmac_secret != d4sign_api_hmac_secret_old:
            updated = True
            company.d4sign_api_hmac_secret = d4sign_api_hmac_secret
            updated_fields["d4sign_api_hmac_secret"] = {"old": None, "new": None}

    if d4sign_safe_name is not None:
        d4sign_safe_name_old = company.d4sign_safe_name
        if d4sign_safe_name != d4sign_safe_name_old:
            updated = True
            company.d4sign_safe_name = d4sign_safe_name
            updated_fields["d4sign_safe_name"] = {
                "old": d4sign_safe_name_old,
                "new": d4sign_safe_name,
            }

    if updated:
        db.session.add(company)
        db.session.commit()
    else:
        control["message"] = "No fields were updated"
        control["status_code"] = 202
        return control

    control["message"] = "Successfully updated company's D4Sign info"
    control["data"]["company_id"] = company_id
    control["data"]["updated_fields"] = updated_fields

    return control


def d4sign_upload_document_controller(
    user, document_instance, version_id: str = "0"
) -> dict:
    """
    Controls D4Sign document uploading.
    docs: https://docapi.d4sign.com.br/pt-br/v1/api/endpoints-post
    """
    control = {"status_code": 200, "message": "", "data": {}}

    if document_instance.d4sign_document_uuid is not None:
        control["message"] = "Document already uploaded"
        control["status_code"] = 202
        return control

    remote_document = RemoteDocument()

    ext = document_instance.text_type.replace(".", "")
    if ext == "docx":
        document_file = remote_document.download_docx_from_documents(
            document=document_instance, version_id=version_id
        )
    elif ext == "pdf":
        document_file = remote_document.download_pdf_from_documents(
            document=document_instance, version_id=version_id
        )  # TODO: implement
    else:
        document_file = remote_document.download_text_from_documents(
            document=document_instance, version_id=version_id
        )

    d4sign_api = D4SignAPI(company=document_instance.company)
    d4sign_api_response_payload = d4sign_api.upload_document_file(
        file=document_file,
        filename=document_instance.title,
        safe_name=document_instance.company.d4sign_safe_name,
        ext=ext,
    )

    d4sign_document_uuid = d4sign_api_response_payload["uuid"]
    document_instance.d4sign_document_uuid = d4sign_document_uuid
    db.session.add(document_instance)
    db.session.commit()

    control["message"] = "Document successfully uploaded"
    control["data"]["d4sign_document_uuid"] = d4sign_document_uuid

    return control


def d4sign_register_document_webhook_controller(user, document_instance) -> dict:
    """
    Controls D4Sign document webhook registering.
    docs: https://docapi.d4sign.com.br/pt-br/v1/webhook-register
    """
    control = {"status_code": 200, "message": "", "data": {}}

    d4sign_document_uuid = document_instance.d4sign_document_uuid
    if d4sign_document_uuid is None:
        control["message"] = "Document has not been uploaded to D4Sign yet"
        control["status_code"] = 403
        return control

    d4sign_api = D4SignAPI(company=document_instance.company)
    d4sign_api_response_payload = d4sign_api.register_document_webhook(
        document_uuid=d4sign_document_uuid
    )

    document_webhook_url = d4sign_api_response_payload["document_webhook_url"]

    control["message"] = "Successfully registered document webhook"
    control["data"]["d4sign_document_uuid"] = d4sign_document_uuid
    control["data"]["document_webhook_url"] = document_webhook_url

    return control


def d4sign_register_document_signers_controller(user, document_instance) -> dict:
    """
    Controls D4Sign document signers registering.
    docs: https://docapi.d4sign.com.br/pt-br/v1/api/endpoints-post
    """
    control = {"status_code": 200, "message": "", "data": {}}

    if document_instance.d4sign_document_uuid is None:
        control["message"] = "Document has not been uploaded to D4Sign yet"
        control["status_code"] = 403
        return control

    d4sign_api = D4SignAPI(company=document_instance.company)

    registered_emails = []
    signers_modified = False

    for signer in document_instance.signers:
        if signer["status"] != "":
            continue
        for field in signer["fields"]:
            if field["type"] == "email":
                signer_email = document_instance.variables[field["variable"]]
                break
        d4sign_api_response_payload = d4sign_api.register_document_signer(
            document_uuid=document_instance.d4sign_document_uuid,
            signer_email=signer_email,
        )
        if d4sign_api_response_payload["message"][0]["success"] == "1":
            signer["status"] = "registered"
            registered_emails.append(signer_email)
            signers_modified = True

    if signers_modified:
        flag_modified(document_instance, "signers")
        db.session.add(document_instance)
        db.session.commit()

    control["message"] = "Successfully registered document signers"
    control["data"]["registered_emails"] = registered_emails

    return control


def d4sign_send_document_for_signing_controller(user, document_instance) -> dict:
    """
    Controls D4Sign document requests for signing.
    docs: https://docapi.d4sign.com.br/pt-br/v1/api/endpoints-post
    """
    control = {"status_code": 200, "message": "", "data": {}}

    if document_instance.d4sign_document_uuid is None:
        control["message"] = "Document has not been uploaded to D4Sign yet"
        control["status_code"] = 403
        return control

    d4sign_api = D4SignAPI(company=document_instance.company)

    sent_emails = []
    already_sent_emails = []
    not_registered_emails = []
    signers_modified = False

    for signer in document_instance.signers:
        for field in signer["fields"]:
            if field["type"] == "email":
                signer_email = document_instance.variables[field["variable"]]
                break
        if signer["status"] in ["sent", "Completed"]:
            already_sent_emails.append(signer_email)
            continue
        if signer["status"] != "registered":
            not_registered_emails.append(signer_email)
            continue

        sent_emails.append(signer_email)
        signer["status"] = "sent"
        signers_modified = True

    if signers_modified:
        document_instance.sent = True
        d4sign_api.send_document_for_signing(
            document_uuid=document_instance.d4sign_document_uuid
        )
        flag_modified(document_instance, "signers")
        db.session.add(document_instance)
        db.session.commit()

    if not_registered_emails:
        if not sent_emails:
            control["message"] = "Emails are not registered as this document signers"
            control["status_code"] = 403
        else:
            control["message"] = "Partially sent document for signing"
            control["status_code"] = 202
    else:
        control["message"] = "Successfully sent document for signing"

    control["data"]["sent_emails"] = sent_emails
    control["data"]["already_sent_emails"] = already_sent_emails
    control["data"]["not_registered_emails"] = not_registered_emails

    return control


def d4sign_upload_and_send_document_for_signing_controller(
    user, document_id: int
) -> dict:
    """
    Controls the full flow from uploading to sending
    a document for signing on the D4Sign API.
    """
    control = {"status_code": 200, "message": "", "data": {}}

    document_model_instance = Document.query.get(document_id)

    if document_model_instance is None:
        control["message"] = "Document not found"
        control["status_code"] = 404
        return control

    if document_model_instance.company != user.company:
        control["message"] = "Document does not belong to this user's company"
        control["status_code"] = 403
        return control

    if document_model_instance.company.signatures_provider != "d4sign":
        control["message"] = (
            "Signatures for this document " "are not provided through D4Sign"
        )
        control["status_code"] = 451
        return control

    controllers = [
        d4sign_upload_document_controller,
        d4sign_register_document_webhook_controller,
        d4sign_register_document_signers_controller,
        d4sign_send_document_for_signing_controller,
    ]

    for controller in controllers:
        control = controller(user=user, document_instance=document_model_instance)
        if control["status_code"] not in [200, 202]:
            return control

    d4sign_update_document_certificate_file_controller(document_model_instance)

    updated_document_model_instance = Document.query.get(document_id)

    return updated_document_model_instance, control


def d4sign_document_webhook_controller(
    document, type_post: str, signer_email: str = ""
) -> dict:
    """
    Controls D4Sign document webhooks.
    docs: https://docapi.d4sign.com.br/pt-br/v1/webhooks
    """
    control = {"status_code": 200, "message": ""}

    d4sign_document_uuid = document.d4sign_document_uuid

    if type_post == "1":  # Finished
        if not document.signed:
            document.signed = True
            document.data_assinatura = date.today()
            signers_modified = False
            for signer in document.signers:
                if signer["status"] != "Completed":
                    signer["status"] = "Completed"
                    signers_modified = True
            if signers_modified:
                flag_modified(document, "signers")
            db.session.add(document)
            db.session.commit()

        d4sign_update_document_certificate_file_controller(document)

        control["message"] = (
            f"Document with d4sign_document_uuid "
            f"<{d4sign_document_uuid}> finished signing"
        )
        return control

    if type_post == "2":  # E-mail not sent
        found_signer = False
        for signer in document.signers:
            for field in signer["fields"]:
                if (
                    field["type"] == "email"
                    and document.variables[field["variable"]] == signer_email
                ):
                    found_signer = True
                    break
                if found_signer:
                    break
            if found_signer:
                break
        if not found_signer:
            control["message"] = (
                f"Person with email {signer_email} "
                f"is not a signer for the document "
                f"with d4sign_document_uuid <{d4sign_document_uuid}>"
            )
            control["status_code"] = 403
            return control

        signer["status"] = "registered"

        flag_modified(document, "signers")
        db.session.add(document)
        db.session.commit()

        control["message"] = (
            f"A signature request for the document "
            f"with d4sign_document_uuid <{d4sign_document_uuid}> "
            f"was not sent to email {signer_email}"
        )
        return control

    if type_post == "3":  # Cancelled
        document.signed = False
        document.data_assinatura = None
        for signer in document.signers:
            signer["status"] = ""
            signer["signing_date"] = ""

        flag_modified(document, "signers")
        db.session.add(document)
        db.session.commit()

        d4sign_update_document_certificate_file_controller(document)

        control["message"] = (
            f"Signatures for document "
            f"with d4sign_document_uuid <{d4sign_document_uuid}> "
            f"were cancelled"
        )
        return control

    if type_post == "4":  # Signed
        found_signer = False
        for signer in document.signers:
            for field in signer["fields"]:
                if (
                    field["type"] == "email"
                    and document.variables[field["variable"]] == signer_email
                ):
                    found_signer = True
                    break
                if found_signer:
                    break
            if found_signer:
                break
        if not found_signer:
            control["message"] = (
                f"Person with email {signer_email} "
                f"is not a signer for the document "
                f"with d4sign_document_uuid <{d4sign_document_uuid}>"
            )
            control["status_code"] = 403
            return control

        signer["status"] = "Completed"
        signer["signing_date"] = (
            datetime.utcnow().astimezone().replace(microsecond=0).isoformat()
        )

        flag_modified(document, "signers")  # no need of deepcopying JSON field
        db.session.add(document)
        db.session.commit()

        d4sign_update_document_certificate_file_controller(document)

        control["message"] = (
            f"Person with email {signer_email} "
            f"successfully signed the document "
            f"with d4sign_document_uuid <{d4sign_document_uuid}>"
        )
        return control


def d4sign_update_document_certificate_file_controller(
        document
) -> dict:
    """
    Controls updating the document's certificate file on S3.
    The full file, which contains both the document and the certificate,
    is downloaded from the D4Sign API, then the certificate is uploaded to the bucket.
    This update is meant to happen every time there is an update on the document.
    """
    control = {"status_code": 200, "message": "", "data": {}}

    d4sign_api = D4SignAPI(company=document.company)
    document_file_download_info = d4sign_api.get_document_file_download_info(
        document_uuid=document.d4sign_document_uuid
    )

    document_file_download_url = document_file_download_info['url']
    document_file = requests.get(document_file_download_url).content
    document_pdf = PdfReader(io.BytesIO(document_file))

    certificate_pdf = PdfWriter()
    certificate_pdf.addpage(document_pdf.pages[-1])  # certificate is in the last page (always?)
    certificate_file = io.BytesIO()
    certificate_pdf.write(certificate_file)
    certificate_file = certificate_file.getvalue()

    s3_client = boto3.client('s3')
    bucket = current_app.config['AWS_S3_DOCUMENTS_BUCKET']
    filepath = f'{document.company.id}/certificates/{document.id}/certificate.pdf'
    s3_client.put_object(
        Body=certificate_file,
        Bucket=bucket,
        Key=filepath,
    )

    return control


def d4sign_generate_document_certificate_file_presigned_url_controller(
    user,
    document
) -> dict:
    """
    Controls generating an accessible url for the document's certificate file.
    """
    control = {"status_code": 200, "message": "", "data": {}}

    if document.company != user.company:
        control["status_code"] = 403
        control["message"] = "Document does not belong to this user's company"
        return control

    s3_client = boto3.client('s3')
    bucket = current_app.config['AWS_S3_DOCUMENTS_BUCKET']
    filepath = f'{document.company.id}/certificates/{document.id}/certificate.pdf'
    try:
        s3_client.head_object(Bucket=bucket, Key=filepath)
    except (Exception,):
        d4sign_update_document_certificate_file_controller(document)
    try:
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': filepath},
            ExpiresIn=180
        )
    except (Exception,):
        control['status_code'] = 404
        control['message'] = 'Certificate file not found'
    else:
        control['data']['url'] = presigned_url
    return control
