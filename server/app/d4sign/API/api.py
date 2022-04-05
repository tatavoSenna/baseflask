import json
import requests

from enum import Enum
from io import BytesIO
from typing import Dict, List

from flask import current_app

from .security import generate_hmac_sha256


class MIME(Enum):
    DOCX = "application/vnd.openxmlformats-officedocument." "wordprocessingml.document"
    PDF = "application/pdf"


class D4SignAPI:
    """
    Class to integrate with D4Sign API.
    docs: https://docapi.d4sign.com.br/
    """

    def __init__(self, config=None, company=None):
        if config is None:
            config = {
                k: v
                for k, v in current_app.config.items()
                if k.startswith("D4SIGN_API")
            }

        self.config = config
        self.url = config.get("D4SIGN_API_URL")
        self.document_webhook_url = config.get("D4SIGN_API_DOCUMENT_WEBHOOK_URL")

        if company is None:
            self.token = config.get("D4SIGN_API_LAWING_TOKEN")
            self.cryptkey = config.get("D4SIGN_API_LAWING_CRYPTKEY")
            self.hmac_secret = config.get(
                "D4SIGN_API_LAWING_DOCUMENT_WEBHOOK_HMAC_SECRET"
            )
        else:
            self.token = company.d4sign_api_token
            self.cryptkey = company.d4sign_api_cryptkey
            self.hmac_secret = company.d4sign_api_hmac_secret

    def put_url_credentials(self, url: str = "") -> str:
        return "{}?tokenAPI={}&cryptKey={}".format(url, self.token, self.cryptkey)

    @property
    def safes(self) -> List[Dict]:
        """
        Safes are top-level containers on the D4Sign API.
        return example = [
            {
                'uuid_safe': 'a1-b2-c3',
                'name-safe': 'Company XYZ'
            }
        ]
        """
        url = f"{self.url}/safes"
        url = self.put_url_credentials(url)

        response = requests.get(url)
        assert response.status_code == 200

        response_payload = response.json()
        return response_payload

    def get_safe(self, safe_uuid: str = "", safe_name: str = "") -> Dict:
        """
        Specific safe container data.
        Must provide safe_uuid (takes precedence) or safe_name.
        return example = {
            'uuid_safe': 'a1-b2-c3',
            'name-safe': 'Company XYZ'
        }
        """
        assert safe_uuid or safe_name
        if safe_uuid:
            lookup_key = "uuid_safe"
            lookup_val = safe_uuid
        else:
            lookup_key = "name-safe"
            lookup_val = safe_name

        safes = self.safes
        try:
            (safe,) = filter(lambda safe: safe[lookup_key] == lookup_val, safes)
        except ValueError as e:
            raise type(e)("Safe not found")

        return safe

    def get_folders(self, safe_uuid: str = "", safe_name: str = "") -> List[Dict]:
        """
        Folders from inside a specific safe container.
        Must provide safe_uuid (takes precedence) or safe_name.
        return example = [
            {
                'uuid_safe': 'a1-b2-c3',
                'uuid_folder': 'a1-b2-c3',
                'name': 'Department XYZ',
                'dt_cadastro': '2021-01-01 00:00:00'
            }
        ]
        """
        safe = self.get_safe(safe_uuid=safe_uuid, safe_name=safe_name)
        safe_uuid = safe["uuid_safe"]  # in case only safe_name was passed

        url = f"{self.url}/folders/{safe_uuid}/find"
        url = self.put_url_credentials(url)

        response = requests.get(url)
        assert response.status_code == 200

        response_payload = response.json()
        return response_payload

    def upload_document_file(
        self,
        file: BytesIO,
        filename: str,
        safe_uuid: str = "",
        safe_name: str = "",
        folder_uuid: str = "",
        folder_name: str = "",
        ext: str = "docx",
    ) -> Dict:
        """
        Uploads a document file to the D4Sign API.
        Must provide safe_uuid (takes precedence) or safe_name.
        Folder args are optional.
        return example = {
            'message': 'success',
            'uuid': 'a1-b2-c3' (Document UUID)
        }
        """
        safe = self.get_safe(safe_uuid=safe_uuid, safe_name=safe_name)
        safe_uuid = safe["uuid_safe"]  # in case only safe_name was passed

        url = f"{self.url}/documents/{safe_uuid}/upload"
        url = self.put_url_credentials(url)

        if not filename.endswith(f".{ext}"):
            filename += f".{ext}"

        payload = {"uuid_folder": ""}  # TODO: Implement folder when necessary

        mime = getattr(MIME, ext.upper()).value
        files = [("file", (filename, file.getvalue(), mime))]

        response = requests.post(url, data=payload, files=files)
        assert response.status_code == 200

        response_payload = response.json()
        return response_payload

    def get_document_file_download_info(
        self,
        document_uuid: str,
    ) -> Dict:
        """
        Returns the download information for a specific document file.
        return example = {
            'name': 'My Document',
            'url': '...d4sign.com.br/.../<some hash>'
        }
        """
        url = f"{self.url}/documents/{document_uuid}/download"
        url = self.put_url_credentials(url)

        response = requests.post(url)
        assert response.status_code == 200

        response_payload = response.json()
        return response_payload

    def register_document_webhook(self, document_uuid: str) -> Dict:
        """
        Registers a webhook to a D4Sign document.
        docs: https://docapi.d4sign.com.br/pt-br/v1/webhook-register
        return example = {
            'message': 'Webhook successfully registered'
        }
        """
        url = f"{self.url}/documents/{document_uuid}/webhooks"
        url = self.put_url_credentials(url)

        headers = {
            "Content-Type": "application/json",
        }

        hmac_sha256 = generate_hmac_sha256(
            hmac_secret=self.hmac_secret, document_uuid=document_uuid
        )

        document_webhook_url = f"{self.document_webhook_url}/{hmac_sha256}/"

        payload = {"url": document_webhook_url}
        payload = json.dumps(payload)

        response = requests.post(url, headers=headers, data=payload)
        assert response.status_code == 200

        response_payload = response.json()
        response_payload["document_webhook_url"] = document_webhook_url
        return response_payload

    def register_document_signer(
        self,
        document_uuid: str,
        signer_email: str,
        act: int = 1,
        foreign: int = 0,
        foreign_lang: str = "ptBR",
        certificadoicpbr: int = 0,
        assinatura_presencial: int = 0,
    ):
        """
        Tells the D4Sign API who (individually) shall sign the document.
        See docs for a complete list of the arguments descriptions.
        docs: https://docapi.d4sign.com.br/pt-br/v1/api/endpoints-post (Cadastrar signatários)
        return example = {
            'message': [{
                'key_signer': 'A1B2C3',
                'email': 'client@company.com',
                'act': 1,
                ...
                'status': 'created'
            }]
        }
        """
        url = f"{self.url}/documents/{document_uuid}/createlist"
        url = self.put_url_credentials(url)

        headers = {"Content-Type": "application/json", "Accept": "application/json"}

        payload = {
            "signers": [
                {
                    "email": signer_email,
                    "act": act,
                    "foreign": foreign,
                    "foreign_lang": foreign_lang,
                    "certificadoicpbr": certificadoicpbr,
                    "assinatura_presencial": assinatura_presencial,
                }
            ]
        }
        payload = json.dumps(payload)

        response = requests.post(url, headers=headers, data=payload)
        response_payload = response.json()

        return response_payload

    def send_document_for_signing(
        self,
        document_uuid: str,
        message: str = "",
        skip_email: int = 0,
        workflow: int = 0,
    ):
        """
        Tells the D4Sign API to request for signers to sign a document.
        An e-mail will be sent to them.
        See docs for a complete list of the arguments descriptions.
        docs: https://docapi.d4sign.com.br/pt-br/v1/api/endpoints-post (Enviar um documento para assinatura)
        return example = {
            'message': 'File sent to successfully signing'
        }
        """
        url = f"{self.url}/documents/{document_uuid}/sendtosigner"
        url = self.put_url_credentials(url)

        headers = {"Content-Type": "application/json", "Accept": "application/json"}

        payload = {"message": message, "skip_email": skip_email, "workflow": workflow}

        response = requests.post(url, headers=headers, data=payload)
        response_payload = response.json()

        return response_payload
