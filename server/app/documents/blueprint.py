import os
import io
import logging
import base64
import json
import uuid

from datetime import datetime

import boto3
import pdfrw

from flask import request, Blueprint, abort, jsonify

from botocore.exceptions import ClientError
from docusign_esign import (ApiClient, EnvelopesApi, EnvelopeDefinition, Signer,
    SignHere, Tabs, Recipients, Document as DocusignDocument)
from docxtpl import DocxTemplate
from slugify import slugify
from sqlalchemy import desc

from app import db, aws_auth
from app.constants import months
from app.controllers import get_document_templates, get_documents, create_document
from app.models.documents import Document, DocumentVersion, DocumentTemplate
from app.serializers.document_serializers import DocumentSerializer
from app.users.remote import get_local_user
from app.docusign.serializers import EnvelopeSerializer
from app.docusign.services import get_token


documents_bp = Blueprint('documents', __name__)

@documents_bp.route('/')
@aws_auth.authentication_required
@get_local_user
def get_document_list(current_user):

    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        search_param = str(request.args.get('search', ''))
    except:
        abort(400, "invalid parameters")

    paginated_query = Document.query \
        .filter_by(company_id=current_user['company_id']) \
        .filter(Document.title.ilike(f'%{search_param}%')) \
        .order_by(desc(Document.created_at)) \
        .paginate(page=page, per_page=per_page)

    return jsonify({
        'page': paginated_query.page,
        'per_page': paginated_query.per_page,
        'total': paginated_query.total,
        'items': DocumentSerializer(many=True).dump(paginated_query.items)
    })


@documents_bp.route('/create', methods=['POST'])
@aws_auth.authentication_required
@get_local_user
def create(current_user):

    # check if content_type is json
    if not request.is_json:
        return jsonify({'message': 'Accepts only content-type json.'}), 400
    else:
        content = request.json

    # check for required parameters
    document_template_id = content.get('document', None)
    answers = content.get('questions', None)
    if not document_template_id or not answers:
        return jsonify({'message': 'Value is missing. Needs questions and document model id'}), 400

    # loads the document model
    document_template = DocumentTemplate.query.get(document_template_id)
    if not document_template:
        return jsonify({'message': 'Document model is missing.'}), 404

    context = {}
    unique_id = uuid.uuid1()
    title = f'{document_template.name}-{unique_id}'

    with open('app/documents/questions/%s.json' % document_template_id, encoding='utf-8') as json_file:
        decision_tree = json.load(json_file)
    for key in decision_tree['nodes']:
        for question in decision_tree['nodes'][key]['questions']:

            # get answers for question on the answers list
            if 'variable' in question and question['variable'] in answers:
                context[question['variable']] = answers[question['variable']]

                # add treatment for pdf checkboxes
                if 'pdf_option_type' in question and question['pdf_option_type'] == 'check_boxes':
                    context[answers['variable']] = pdfrw.PdfName('On')

                # gets the title from the user's answers and  the filename from the document_title
                if question['variable'] == 'title':
                    title = f'{answers["title"]}-{unique_id}'

    now = datetime.now()
    context['day'] = str(now.day).zfill(2)
    context['month'] = months[now.month - 1]
    context['year'] = now.year
    context['today'] = f'{ str(now.day).zfill(2)}/{months[now.month - 1]}/{now.year}'

    if document_template.model_type == 'docx':
        # generate document from docx_template
        doc = DocxTemplate(f'app/documents/template/{document_template_id}.docx')
        doc.render(context)
        document_buffer = io.BytesIO()
        doc.save(document_buffer)
    elif document_template.model_type == 'pdf':
        # generate document from pdf
        pdf_template = pdfrw.PdfReader(
            f'app/documents/template/{document_template_id}.pdf')
        for page in pdf_template.Root.Pages.Kids:
            if page.Annots:
                for field in page.Annots:
                    if field['/T'] and field['/T'][1:-1] in context.keys():
                        kwargs = {'V': context[field['/T'][1:-1]]}
                        field.update(pdfrw.PdfDict(**kwargs))
        pdf_template.Root.AcroForm.update(pdfrw.PdfDict(
            NeedAppearances=pdfrw.PdfObject('true')))
        temp_file_name = f'{unique_id}_temp.pdf'
        pdfrw.PdfWriter().write(temp_file_name, pdf_template)
        document_buffer = open(temp_file_name, 'rb')
        document_buffer.read()
        os.remove(temp_file_name)

    # save generated document to an s3
    s3_client = boto3.client('s3')
    s3_object_key = f'{slugify(title)}_{int(datetime.now().timestamp())}'
    document_buffer.seek(0)
    try:
        s3_client.upload_fileobj(
            document_buffer, 'lawing-documents', s3_object_key)
    except ClientError as e:
        print(f'error uploading to s3 {e}')

    new_document = create_document(
        current_user['company_id'],
        current_user['id'],
        title,
        document_template_id,
        answers,
        s3_object_key,
    )
    return new_document


@documents_bp.route('/<int:document_id>/download')
@aws_auth.authentication_required
@get_local_user
def download(current_user, document_id):

    if not document_id:
        abort(400, 'Missing document id')

    try:
        document = Document.query.get(document_id)
        last_version = DocumentVersion.query.filter_by(
            document_id=document_id).order_by(DocumentVersion.version_number).first()
    except Exception:
        abort(404, 'Document not Found')

    s3_client = boto3.client('s3')
    document_url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': 'lawing-documents',
            'Key': document.versions[0].filename
            },
            ExpiresIn=180)


    response = {
        'download_url': document_url,
        'document_name': f'{document.versions[0].filename}.{document.model.model_type}'
    }

    return jsonify(response)


@documents_bp.route('/<int:document_id>/sign')
@aws_auth.authentication_required
@get_local_user
def request_signatures(current_user, document_id):

    if not document_id:
        abort(400, 'Missing document id')

    try:
        last_version = DocumentVersion.query.filter_by(
            document_id=document_id).order_by(DocumentVersion.version_number).first()
    except Exception:
        abort(404, 'Document not Found')

    answers = {}
    signers_data = []
    for question in last_version.answers:

        # check if the question has been answered
        if 'variable' in question and 'answer' in question and question['answer'] != '':
            # gather all answers on an dictionary becaus we may need info when gatthering signers
            variable_name = question['variable']
            answers[question['variable']] = question['answer']

            # Variables that identify signers end with "signer"
            if variable_name.find('signer') >= 0:
                if 'docusign_data' in question:
                    signer_data = question['docusign_data']
                    signer_data['name'] = answers[question['docusign_data']
                                                  ['name_variable']]
                    signer_data['email'] = question['answer']
                    signers_data.append(signer_data)

    try:
        s3_client = boto3.client('s3')
        document_buffer = io.BytesIO()
        s3_client.download_fileobj(
            'lawing-documents', f'{last_version.filename}', document_buffer)
    except ClientError as e:
        logging.error(e)

    document_buffer.seek(0)
    base64_document = base64.b64encode(document_buffer.read()).decode('ascii')

    if len(signers_data) > 0:

        # create the DocuSign document object
        document = DocusignDocument(
            document_base64=base64_document,
            name=last_version.document.title,
            file_extension=last_version.document.model.model_type,
            document_id=1
        )

        signers = []
        for index, signer_data in enumerate(signers_data):
            # Create the signer recipient model
            signer = Signer(  # The signer
                email=signer_data['email'], name=signer_data['name'], recipient_id=str(index + 1), routing_order="1")

            # Create a sign_here tab on the document, either relative to an anchor string or to the document page
            if signer_data.get('anchor_string', None):
                sign_here = SignHere(
                    recipient_id='1', tab_label='assine aqui',
                    anchor_string=signer_data['anchor_string'],
                    anchor_x_offset=signer_data['anchor_x_offset'],
                    anchor_y_offset=signer_data['anchor_y_offset'],
                    anchor_ignore_if_not_present="false",
                    anchor_units="inches"
                )
            else:
                sign_here = SignHere(
                    recipient_id='1',
                    document_id=1,
                    tab_label='assine aqui',
                    x_position=signer_data['x_position'],
                    y_position=signer_data['y_position'],
                    page_number=signer_data['page_number']
                )

            # Add the tabs model (including the sign_here tab) to the signer
            # The Tabs object wants arrays of the different field/tab types
            signer.tabs = Tabs(sign_here_tabs=[sign_here])

            signers.append(signer)

        # Next, create the top level envelope definition and populate it.
        envelope_definition = EnvelopeDefinition(
            email_subject=last_version.document.title,
            # The order in the docs array determines the order in the envelope
            documents=[document],
            # The Recipients object wants arrays for each recipient type
            recipients=Recipients(signers=signers),
            status="sent"  # requests that the envelope be created and sent.
        )

        # Ready to go: send the envelope request
        api_client = ApiClient()
        api_client.host = 'https://demo.docusign.net/restapi'
        api_client.set_default_header(
            "Authorization",
            "Bearer " + get_token(current_user)
        )

        envelope_api = EnvelopesApi(api_client)
        try:
            envelope = envelope_api.create_envelope(
                '957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_definition=envelope_definition)
        except Exception as e:
            logging.error(e)
            return jsonify({'message': 'Error accessing docusign api.'}), 400

        # save envelope data on document
        document = Document.query.get(document_id)
        document.envelope = json.dumps(EnvelopeSerializer().dump(envelope))
        db.session.commit()

        # envelop_summary_2 = envelope_api.get_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_summary.envelope_id)

        return jsonify(DocumentSerializer().dump(document))
    else:
        return jsonify({'message': 'No signers.'}), 400


@documents_bp.route('/models', methods=['GET'])
@aws_auth.authentication_required
@get_local_user
def documents(current_user):

    document_templates = get_document_templates(current_user['company_id'])

    return jsonify(document_templates)


@documents_bp.route('/questions', methods=['GET'])
@aws_auth.authentication_required
@get_local_user
def questions(current_user):
    # TODO: change parameter to 'model'
    document_template = request.args.get('document')

    if not document_template:
        return jsonify({'message': 'Value is missing.'}), 404

    with open('app/documents/questions/%s.json' % document_template, encoding='utf-8') as json_file:
        decision_tree = json.load(json_file)

    return jsonify(decision_tree)
