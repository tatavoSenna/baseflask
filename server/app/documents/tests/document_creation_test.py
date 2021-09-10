import pytest

from docx import Document as DocxDocument
from io import BytesIO
from unittest.mock import patch

from app.test import factories
from app.documents.controllers import (
    create_document_controller
)


def generate_docx(text: str = '') -> BytesIO:
    docx_document = DocxDocument()
    docx_document.add_paragraph(text)
    docx = BytesIO()
    docx_document.save(docx)
    return docx


date_field = {
    'info': '',
    'type': 'date',
    'label': '',
    'variables': {
        'name': 'DATA',
        'type': 'date',
        'doc_display_style': '%d/%m/%Y'
    }
}

@pytest.fixture
def user():
    return factories.UserFactory()

@pytest.fixture
def document_template():
    def _document_template(text_type, fields):
        if not isinstance(fields, list):
            fields = [fields]
        return factories.DocumentTemplateFactory(
            text_type=text_type,
            form=[{'fields': fields}],
            workflow={
                'nodes': {},
                'created_by': '',
                'current_node': '0'
            }
        )
    return _document_template

@patch('app.documents.controllers.RemoteDocument.download_docx_from_template')
@patch('app.documents.controllers.RemoteDocument.upload_filled_docx_to_documents')
@patch('app.documents.controllers.convert_docx_to_pdf_and_save')
def test_creation_of_docx_document_with_date_field(convert_docx_to_pdf_and_save,
                                                   upload_filled_docx_to_documents,
                                                   download_docx_from_template,
                                                   user,
                                                   document_template):
    
    template_docx = generate_docx('Data: {{ DATA }}')
    download_docx_from_template.return_value = template_docx

    template = document_template('.docx', date_field)
    variables = {'DATA': '2021-12-31T12:34:56.789Z'}

    document = create_document_controller(
        user_id=user.id,
        user_email=user.email,
        company_id=user.company.id,
        document_template_id=template.id,
        title='title',
        username=user.username,
        received_variables=variables,
        parent_id=None,
        is_folder=False,
        visible=[[True]]
    )

    upload_filled_docx_to_documents.assert_called_once()
    upload_filled_docx_to_documents_args = \
        upload_filled_docx_to_documents.call_args.args

    assert upload_filled_docx_to_documents_args[0] == document
    assert DocxDocument(upload_filled_docx_to_documents_args[1]) \
                       .paragraphs[0].text == 'Data: 2021-12-31T12:34:56.789Z'
    assert upload_filled_docx_to_documents_args[2] == '.docx'    