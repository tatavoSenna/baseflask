from flask import Blueprint, current_app, jsonify, request

from app.users.remote import authenticated_user
from app.models import Document

from .API.security import generate_hmac_sha256

from .controllers import (
    d4sign_get_company_info_controller,
    d4sign_update_company_info_controller,
    d4sign_upload_document_controller,
    d4sign_register_document_webhook_controller,
    d4sign_register_document_signers_controller,
    d4sign_send_document_for_signing_controller,
    d4sign_upload_and_send_document_for_signing_controller,
    d4sign_document_webhook_controller,
    d4sign_cancel_document,
)

from app.serializers.document_serializers import DocumentSerializer


d4sign_bp = Blueprint("d4sign", __name__)


@d4sign_bp.route("/company-info", methods=["GET"])
@authenticated_user
def d4sign_get_company_info(user):
    payload = request.json

    company_id = payload["company_id"]

    control = d4sign_get_company_info_controller(user=user, company_id=company_id)

    status_code = control.pop("status_code")
    response_payload = jsonify(control)

    return response_payload, status_code


@d4sign_bp.route("/company-info", methods=["PUT"])
@authenticated_user
def d4sign_update_company_info(user):
    payload = request.json

    company_id = payload["company_id"]
    d4sign_api_token = payload.get("d4sign_api_token")
    d4sign_api_cryptkey = payload.get("d4sign_api_cryptkey")
    d4sign_api_hmac_secret = payload.get("d4sign_api_hmac_secret")
    d4sign_safe_name = payload.get("d4sign_safe_name")

    control = d4sign_update_company_info_controller(
        user=user,
        company_id=company_id,
        d4sign_api_token=d4sign_api_token,
        d4sign_api_cryptkey=d4sign_api_cryptkey,
        d4sign_api_hmac_secret=d4sign_api_hmac_secret,
        d4sign_safe_name=d4sign_safe_name,
    )

    status_code = control.pop("status_code")
    response_payload = jsonify(control)

    return response_payload, status_code


@d4sign_bp.route("/upload-and-send-document-for-signing/", methods=["POST"])
@authenticated_user
def d4sign_upload_and_send_document_for_signing(user):
    payload = request.json

    document_id = payload["document_id"]

    document, control = d4sign_upload_and_send_document_for_signing_controller(
        user=user, document_id=document_id
    )

    if control["status_code"] not in [200, 202]:
        status_code = control.pop("status_code")
        response_payload = jsonify(control)

        return response_payload, status_code

    return jsonify(DocumentSerializer().dump(document))


@d4sign_bp.route("/document-webhook/<hmac_sha256>/", methods=["POST"])
def d4sign_document_webhook(hmac_sha256):
    payload = request.form

    d4sign_document_uuid = payload["uuid"]
    type_post = payload["type_post"]
    signer_email = payload.get("email", "")

    document = Document.query.filter_by(
        d4sign_document_uuid=d4sign_document_uuid
    ).first()

    if document is None:
        return (
            jsonify(
                {
                    "message": f"Document with d4sign_document_uuid "
                    f"<{d4sign_document_uuid}> not found"
                }
            ),
            404,
        )

    hmac_secret = document.company.d4sign_api_hmac_secret
    hmac_sha256_valid = generate_hmac_sha256(
        hmac_secret=hmac_secret, document_uuid=d4sign_document_uuid
    )

    if hmac_sha256 != hmac_sha256_valid:
        return {"message": "HMAC not valid"}, 401

    control = d4sign_document_webhook_controller(
        document=document, type_post=type_post, signer_email=signer_email
    )

    status_code = control.pop("status_code")
    response_payload = jsonify(control)

    return response_payload, status_code


@d4sign_bp.route("/cancel-document/<document_id>", methods=["PUT"])
@authenticated_user
def d4sign_cancel_document_route(user, document_id):
    control = d4sign_cancel_document(user=user, document_id=document_id)

    status_code = control.pop("status_code")

    # if we receive a error string in control['data], return
    if type(control["data"]) is str:
        response_payload = jsonify(control)
        return response_payload, status_code
    else:  # if not, we should be receiving a document from the controller, serializing it and sending it back in the response body.
        response_payload = jsonify(DocumentSerializer(many=False).dump(control["data"]))
        return response_payload, status_code
