import boto3
import io
from flask import current_app
import base64

class RemoteTemplate:

    s3_client = boto3.client("s3")
        
    def upload_template(self, template_text, template_id, company_id):
        template_path = f'{company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{template_id}.txt'
        template_text = template_text.encode()
        template = io.BytesIO(template_text)
        self.s3_client.upload_fileobj(
            template,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            template_path
        )
