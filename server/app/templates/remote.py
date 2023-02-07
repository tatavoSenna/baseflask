import boto3
import io
from flask import current_app
import base64


class RemoteTemplate:
    s3_client = boto3.client("s3")

    def upload_template(self, template_text, template_id, company_id):
        template_path = f'{company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{template_id}/{template_id}.txt'
        template_text = template_text.encode()
        template = io.BytesIO(template_text)
        self.s3_client.upload_fileobj(
            template, current_app.config["AWS_S3_DOCUMENTS_BUCKET"], template_path
        )

    def download_text_from_template(self, document_template):
        text_file_io = io.BytesIO()
        remote_path = (
            f'{document_template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}'
            + f"/{document_template.id}/{document_template.id}.txt"
        )

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path, text_file_io
        )
        text_file = text_file_io.getvalue()

        return text_file

    def delete_template(self, document_template):
        s3_resource = boto3.resource("s3")

        remote_path = f'{document_template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{document_template.id}/'

        bucket = s3_resource.Bucket(current_app.config["AWS_S3_DOCUMENTS_BUCKET"])
        bucket.objects.filter(Prefix=remote_path).delete()

    def upload_file_template(self, uploaded_file, filename, template_id, company_id):
        template_path = f'{company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{template_id}/{filename}'
        template_text = uploaded_file.read()
        template = io.BytesIO(template_text)
        self.s3_client.upload_fileobj(
            template, current_app.config["AWS_S3_DOCUMENTS_BUCKET"], template_path
        )

    def download_file_template(self, template):
        remote_path = (
            f'{template.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{template.id}/{template.filename}'
            + template.text_type
        )
        document_url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                "Key": remote_path,
            },
            ExpiresIn=180,
        )
        return document_url
