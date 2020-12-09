from flask import request, Blueprint, abort, jsonify
from app.docusign.services import fetch_docusign_token
from app.docusign.services import set_user_token
from app.users.remote import get_local_user
from app import aws_auth
from bs4 import BeautifulSoup
from app.docusign.controllers import update_signer_status


docusign_bp = Blueprint("docusign", __name__)

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
        ) = fetch_docusign_token(data)
        set_user_token(
            current_user.get(
                "id"), access_token, refresh_token, token_obtain_date
        )
        status_code = 500 if error else 200
    except Exception as e:
        print(e)
        expires_in = None
        error = "Something went wrong"
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
    (access_token, refresh_token, token_obtain_date) = fetch_docusign_token(data)
    set_user_token(
        current_user.get("id"), access_token, refresh_token, token_obtain_date
    )
    return {"success": True}


@docusign_bp.route('signed', methods=['POST'])
def docusign_follow_up():
    xml = BeautifulSoup(request.data, "xml")
    envelope_id = xml.EnvelopeStatus.EnvelopeID.string

    # for every signer if it has finished signing update his signing time
    for signer_status in xml.EnvelopeStatus.RecipientStatuses.find_all('RecipientStatus'):
        if signer_status.Status.string == "Completed":
            update_signer_status(
                docusign_id=envelope_id,
                email=signer_status.Email.string
            )
    return ('Ok', 200)
