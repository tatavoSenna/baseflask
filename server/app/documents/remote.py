import boto3
import io
import requests
import convertapi
import json
import docx
import base64
from io import BufferedReader
import tempfile
from docx.text.paragraph import Paragraph
from docx.oxml.xmlchemy import OxmlElement

from docxtpl import DocxTemplate, InlineImage
from docx import Document
from docx.shared import Cm
from bs4 import BeautifulSoup
from PIL import Image

from datetime import datetime
from flask import current_app

from app import jinja_env


class RemoteDocument:

    s3_client = boto3.client("s3")

    def delete_document(self, document):
        s3_resource = boto3.resource("s3")
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/'
        bucket = s3_resource.Bucket(current_app.config["AWS_S3_DOCUMENTS_BUCKET"])
        bucket.objects.filter(Prefix=remote_path).delete()

    def delete_signed_document(self, document):
        s3_resource = boto3.resource("s3")
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/'
        bucket = s3_resource.Bucket(current_app.config["AWS_S3_DOCUMENTS_BUCKET"])
        bucket.objects.filter(Prefix=remote_path).delete()

    def upload_filled_text_to_documents(self, document, filled_text):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.txt'
        filled_text_io = io.BytesIO(filled_text)

        self.s3_client.upload_fileobj(
            filled_text_io, current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path
        )

    def upload_image(self, document, b64image, image_name):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{image_name}.jpg'
        image_decode = base64.b64decode(b64image)
        image_io = io.BytesIO(image_decode)
        self.s3_client.upload_fileobj(
            image_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            ExtraArgs={"ContentType": "image/jpg"},
        )

    def upload_filled_docx_to_documents(self, document, filled_text_io, text_type):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}{text_type}'
        copy_docx_io = io.BytesIO(filled_text_io.getvalue())

        self.s3_client.upload_fileobj(
            copy_docx_io, current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path
        )

    def download_text_from_documents(self, document, version_id):
        text_file_io = io.BytesIO()
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.txt'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path, text_file_io
        )
        text_file = text_file_io.getvalue()

        return text_file

    def download_docx_from_documents(self, document, version_id):
        docx_io = io.BytesIO()
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.docx'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path, docx_io
        )

        return docx_io

    def download_text_from_template(self, document):
        text_file_io = io.BytesIO()
        remote_path = (
            f'{document.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}'
            + f"/{document.document_template_id}/{document.document_template_id}.txt"
        )

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path, text_file_io
        )
        text_file = text_file_io.getvalue()

        return text_file

    def download_docx_from_template(self, document_template, company_id):
        docx_io = io.BytesIO()
        remote_path = (
            f'{company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{document_template.id}/{document_template.filename}'
            + document_template.text_type
        )

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path, docx_io
        )

        return docx_io

    def get_template(self):
        template_file_io = io.BytesIO()
        remote_path = "template_ckeditor.html"
        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path, template_file_io
        )

        template_file = template_file_io.getvalue()

        return template_file

    def upload_signed_document(self, document, document_bytes):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/{document.title.replace(" ", "_")}.pdf'
        document_pdf = base64.b64decode(document_bytes)
        filled_text_io = io.BytesIO(document_pdf)

        self.s3_client.upload_fileobj(
            filled_text_io, current_app.config["AWS_S3_DOCUMENTS_BUCKET"], remote_path
        )

    def download_signed_document(self, document):
        document_url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                "Key": f'{document.company_id}/{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/{document.title.replace(" ", "_")}.pdf',
            },
            ExpiresIn=180,
        )
        return document_url

    def download_pdf_document(self, document, version_id):
        if version_id is None:
            document_url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                    "Key": f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.pdf',
                },
                ExpiresIn=180,
            )
        else:
            document_url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                    "Key": f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.pdf',
                },
                ExpiresIn=180,
            )
        return document_url

    def download_docx_document(self, document):
        document_url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                "Key": f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.docx',
            },
            ExpiresIn=180,
        )
        return document_url

    def upload_pdf(self, pdf_io, remote_path):

        self.s3_client.upload_fileobj(
            pdf_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            ExtraArgs={"ContentType": "application/pdf"},
        )
