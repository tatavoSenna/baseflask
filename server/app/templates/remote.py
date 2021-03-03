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

    def delete_template(self, document_template):
        s3_resource = boto3.resource("s3")
        remote_path = f'{document_template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{document_template.id}.txt'
        bucket = s3_resource.Bucket(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"])
        bucket.objects.filter(Prefix=remote_path).delete()
