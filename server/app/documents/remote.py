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

from docxtpl import DocxTemplate, InlineImage, Document
from docx.shared import Cm
from bs4 import BeautifulSoup
from PIL import Image

from datetime import datetime
from flask import current_app

from app import jinja_env


def delete_paragraph(paragraph):
    p = paragraph._element
    p.getparent().remove(p)
    p._p = p._element = None

def separate_string(filename):
    doc = Document(filename)
    for p in doc.paragraphs:
        if '{{ INSERT_PARAGRAFO }}' in p.text:
            inline = p.runs
            # Loop added to work with runs (strings with same style)
            for i in range(len(inline)):
                if '{{ INSERT_PARAGRAFO }}' in inline[i].text:
                    text = inline[i].text.split("{{ INSERT_PARAGRAFO }}")
                    inline[i].text = text[0]
                    inline[i].add_break()
                    for j in range(len(text)):
                        if j != 0:
                            run = p.add_run(text[j])
                            run.add_break()
    doc.save(filename)

class RemoteDocument:

    s3_client = boto3.client("s3")

    def create(self, document, document_template, company_id, variables):
        if document_template.text_type == ".txt":
            text_template = self.download_text_from_template(document)
            filled_text = self.fill_text_with_variables(
                text_template, variables).encode()
            self.upload_filled_text_to_documents(document, filled_text)

        else:
            docx_io = self.download_docx_from_template(
                document_template, company_id)
            filled_docx_io = self.fill_docx_with_variables(
                document, docx_io, variables)

            copy_docx_io = io.BytesIO(filled_docx_io.getvalue())

            self.convert_docx_to_pdf_and_save(document, filled_docx_io)
            self.upload_filled_docx_to_documents(
                document, copy_docx_io, document_template.text_type)

    def delete_document(self, document):
        s3_resource = boto3.resource("s3")
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/'
        bucket = s3_resource.Bucket(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"])
        bucket.objects.filter(Prefix=remote_path).delete()

    def delete_signed_document(self, document):
        s3_resource = boto3.resource("s3")
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/'
        bucket = s3_resource.Bucket(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"])
        bucket.objects.filter(Prefix=remote_path).delete()

    def upload_filled_text_to_documents(self, document, filled_text):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.txt'
        filled_text_io = io.BytesIO(filled_text)

        self.s3_client.upload_fileobj(
            filled_text_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path
        )

    def upload_image(self, document, b64image, image_name):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{image_name}.jpg'
        image_decode = base64.b64decode(b64image)
        image_io = io.BytesIO(image_decode)
        self.s3_client.upload_fileobj(
            image_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            ExtraArgs={'ContentType': "image/jpg"}
        )

    def upload_filled_docx_to_documents(self, document, filled_text_io, text_type):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}{text_type}'

        self.s3_client.upload_fileobj(
            filled_text_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path
        )

    def download_text_from_documents(self, document, version_id):
        text_file_io = io.BytesIO()
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.txt'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            text_file_io)
        text_file = text_file_io.getvalue()

        return text_file

    def download_docx_from_documents(self, document, version_id):
        docx_io = io.BytesIO()
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.docx'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            docx_io)

        return docx_io

    def download_text_from_template(self, document):
        text_file_io = io.BytesIO()
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}' \
            + f'/{document.document_template_id}/{document.document_template_id}.txt'

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            text_file_io)
        text_file = text_file_io.getvalue()

        return text_file

    def download_docx_from_template(self, document_template, company_id):
        docx_io = io.BytesIO()
        remote_path = f'{company_id}/{current_app.config["AWS_S3_TEMPLATES_ROOT"]}/{document_template.id}/{document_template.filename}' \
            + document_template.text_type

        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            docx_io)

        #docx_template = DocxTemplate(text_file_io)

        return docx_io

    def fill_text_with_variables(self, text_template, variables):
        jinja_template = jinja_env.from_string(text_template.decode())
        filled_text = jinja_template.render(variables)

        return filled_text

    def fill_docx_with_variables(self, document, docx_io, variables):

        docx_template = DocxTemplate(docx_io)

        for key in list(variables):
            if key.startswith("image_") and variables[key]:
                sd = docx_template.new_subdoc()
                img_bytes = base64.decodebytes(
                    variables[key].split("base64,")[1].encode('ascii'))
                image = io.BytesIO(img_bytes)
                image_obj = Image.open(io.BytesIO(img_bytes))
                proportion = float(image_obj.size[1]/image_obj.size[0])
                for field in document.form[0]['fields']:
                    if field['variable']['name'] == key.strip("image_"):
                        width_size = field['variable']['width']
                        height_size = width_size * proportion
                        sd.add_picture(image, width=Cm(width_size), height=Cm(height_size))
                        break
                variables[str(key)[len("image_"):]] = sd
                self.upload_image(document, variables[key].split(
                    "base64,")[1], str(key)[len("image_"):])
        docx_template.render(variables)

        filled_text_io = io.BytesIO()
        docx_template.save(filled_text_io)
        filled_text_io.seek(0)

        separate_string(filled_text_io)
        doc = docx.Document(filled_text_io)
        for para in doc.paragraphs:
            if para.text == "" or len(para.text) < 2:
                soup = BeautifulSoup(para._p.xml, 'xml')
                if len(soup.find_all('w:numId')) > 0:
                    delete_paragraph(para)

        fileobj = io.BytesIO()
        doc.save(fileobj)
        fileobj.seek(0)

        return fileobj

    def get_template(self):
        template_file_io = io.BytesIO()
        remote_path = 'template_ckeditor.html'
        self.s3_client.download_fileobj(
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            template_file_io)

        template_file = template_file_io.getvalue()

        return template_file
    

    def upload_signed_document(self, document, document_bytes):
        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/{document.title.replace(" ", "_")}.pdf'
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
                "Key": f'{document.company_id}/{current_app.config["AWS_S3_SIGNED_DOCUMENTS_ROOT"]}/{document.id}/{document.title.replace(" ", "_")}.pdf'
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
                    "Key": f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.pdf'
                },
                ExpiresIn=180,
            )
        else:
            document_url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                    "Key": f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{version_id}.pdf'
                },
                ExpiresIn=180,
            )
        return document_url

    def download_docx_document(self, document):
        document_url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                "Key": f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.docx'
            },
            ExpiresIn=180,
        )
        return document_url

    def convert_docx_to_pdf_and_save(self, document, filled_docx_io):
        convertapi.api_secret = current_app.config["CONVERTAPI_SECRET_KEY"]

        upload_io = convertapi.UploadIO(filled_docx_io, 'filled_docx_io.docx')

        result = convertapi.convert(
            'pdf',
            {'File': upload_io},
            from_format='docx')

        response = requests.get(result.response["Files"][0]["Url"])

        pdf_io = io.BytesIO(response.content)

        remote_path = f'{document.company_id}/{current_app.config["AWS_S3_DOCUMENTS_ROOT"]}/{document.id}/{document.versions[0]["id"]}.pdf'

        self.s3_client.upload_fileobj(
            pdf_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path,
            ExtraArgs={'ContentType': "application/pdf"}
        )

    def update_variables(self, document, document_template, company_id, variables):
        docx_io = self.download_docx_from_template(
            document_template, company_id)
        filled_docx_io = self.fill_docx_with_variables(
            document, docx_io, variables)

        copy_docx_io = io.BytesIO(filled_docx_io.getvalue())

        self.convert_docx_to_pdf_and_save(document, filled_docx_io)
        self.upload_filled_docx_to_documents(
            document, copy_docx_io, document_template.text_type)
