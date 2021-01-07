from flask import request, Blueprint, abort, jsonify
from app.docusign.services import fetch_docusign_token
from app.docusign.services import set_user_token
from app.users.remote import get_local_user
from app.models.company import Company
from app import aws_auth
from bs4 import BeautifulSoup
from app.docusign.controllers import update_signer_status, update_envelope_status


docusign_bp = Blueprint("docusign", __name__)


class CustomException(Exception):
    def __init__(self, code, msg):
        self.code = code
        self.msg = msg


"""Obtain token from docusign"""


@docusign_bp.route("/token", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def docusign_token(current_user):
    authorization_code = request.args.get("code")
    data = {"grant_type": "authorization_code",
            "code": "{}".format(authorization_code)}

    try:
        (
            access_token,
            refresh_token,
            token_obtain_date,
            expires_in,
            error,
        ) = fetch_docusign_token(current_user, data)
        if error != None:
            code = error["error"]
            msg = error["error_description"]
            raise CustomException(code, msg)
        set_user_token(
            current_user.get(
                "id"), access_token, refresh_token, token_obtain_date
        )
        status_code = 500 if error else 200
    except CustomException as e:
        expires_in = None
        status_code = e.code
        error = e.msg
        # error code can come as int or string
        if not isinstance(e.code, int):
            status_code = 500

    return ({"expires_in": expires_in, "error": error}, status_code)


"""Obtain new token from docusign
Normally works only 30 days after creation
"""


@docusign_bp.route("/refresh", methods=["GET"])
@aws_auth.authentication_required
@get_local_user
def docusign_refresh_token(current_user):
    data = {"grant_type": "refresh_token", "refresh_token": "{}".format("")}
    (access_token, refresh_token, token_obtain_date) = fetch_docusign_token(
        current_user, data)
    set_user_token(
        current_user.get("id"), access_token, refresh_token, token_obtain_date
    )
    return {"success": True}


@docusign_bp.route('signed', methods=['POST'])
def docusign_follow_up():
    xml = BeautifulSoup(request.data, "xml")
    envelope_id = xml.EnvelopeStatus.EnvelopeID.string
    envelope_status = xml.EnvelopeStatus.Status.string
    # check if envelope is done signing
    if envelope_status == 'Completed':
        document_bytes = xml.DocumentPDFs.DocumentPDF.PDFBytes.string
        update_envelope_status(docusign_id=envelope_id,
                               document_bytes=document_bytes)
    # for every signer update his status
    for signer_status in xml.EnvelopeStatus.RecipientStatuses.find_all('RecipientStatus'):
        update_signer_status(
            docusign_id=envelope_id,
            email=signer_status.Email.string,
            status=signer_status.Status.string
        )
    return ('Ok', 200)
