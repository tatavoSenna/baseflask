import boto3
import io

from datetime import datetime
from flask import current_app
import base64

from app import jinja_env


class RemoteDocument:

    s3_client = boto3.client("s3")

    def create(self, document):
        text_template = self.download_text_from_template(document)
        filled_text = self.fill_text_with_variables(
            text_template, document.variables).encode()
        self.upload_filled_text_to_documents(document, filled_text)

    def upload_filled_text_to_documents(self, document, filled_text):
        remote_path = f'{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.txt'
        filled_text_io = io.BytesIO(filled_text)

        self.s3_client.upload_fileobj(
            filled_text_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path
        )

    def download_text_from_documents(self, document, version_id):
        text_file_io = io.BytesIO()
        remote_path = f'{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.txt'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            text_file_io)
        text_file = text_file_io.getvalue()

        return text_file

    def download_text_from_template(self, document):
        text_file_io = io.BytesIO()
        remote_path = f'{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{document.document_template_id}.txt'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            text_file_io)
        text_file = text_file_io.getvalue()

        return text_file

    def fill_text_with_variables(self, text_template, variables):
        jinja_template = jinja_env.from_string(text_template.decode())
        filled_text = jinja_template.render(variables)

        return filled_text

    def get_template(self):
        template_file_io = io.BytesIO()
        remote_path = 'template.html'
        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            template_file_io)

        template_file = template_file_io.getvalue()

        return template_file

    def upload_signed_document(self, document, document_bytes):
        remote_path = f'{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/{document.title.replace(" ", "_")}.pdf'
        document_pdf = base64.b64decode(document_bytes)
        filled_text_io = io.BytesIO(document_pdf)

        self.s3_client.upload_fileobj(
            filled_text_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path
        )

    def download_signed_document(self, document):

        document_url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                "Key": f'{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/{document.title.replace(" ", "_")}.pdf'
            },
            ExpiresIn=180,
        )
        return document_url
