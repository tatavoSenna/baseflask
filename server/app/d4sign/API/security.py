import hmac
from hashlib import sha256


def generate_hmac_sha256(hmac_secret: str, document_uuid: str) -> str:
    secret = str.encode(hmac_secret)
    uuid = str.encode(document_uuid)
    signature = hmac.new(secret, uuid, sha256).hexdigest()
    return signature
