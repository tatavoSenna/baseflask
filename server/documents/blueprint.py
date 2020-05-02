import os
import io
import logging
import base64
from flask import Blueprint
from flask import abort, jsonify
import boto3
from botocore.exceptions import ClientError

from app.models.documents import Document, DocumentVersion
from app.auth.services import check_for_token
from app.serializers.document_serializers import DocumentSerializer
from sqlalchemy import desc
from docusign_esign import ApiClient, EnvelopesApi, EnvelopeDefinition, Signer, SignHere, Tabs, Recipients, Document as DocusignDocument

documents_api = Blueprint('documents', __name__)

@documents_api.route('/')
@check_for_token
def get_document_list(current_user):
    client_documents_list = Document.query.filter_by(client_id=current_user['client_id']).order_by(desc(Document.created_at))
    return jsonify(DocumentSerializer(many=True).dump(client_documents_list))

@documents_api.route('/<int:document_id>/download')
@check_for_token
def download(current_user, document_id):

    if not document_id:
        abort(400, 'Missing document id')

    try:
        last_version = DocumentVersion.query.filter_by(document_id=document_id).order_by(DocumentVersion.version_number).first()
    except Exception:
        abort(404, 'Document not Found')

    s3_client = boto3.client('s3')
    document_url = s3_client.generate_presigned_url(
    'get_object',
    Params={
        'Bucket': 'lawing-documents',
        'Key': last_version.filename
        },
    ExpiresIn=180)

    return jsonify(document_url)

@documents_api.route('/<int:document_id>/sign')
@check_for_token
def request_signatures(current_user, document_id):

    if not document_id:
        abort(400, 'Missing document id')

    try:
        last_version = DocumentVersion.query.filter_by(document_id=document_id).order_by(DocumentVersion.version_number).first()
    except Exception:
        abort(404, 'Document not Found')

    answers = {}
    signers_data = []
    for question in last_version.answers:

        # check if the question has been answered
        if 'variable' in question and 'answer' in question and question['answer']    != '':
            # gather all answers on an dictionary becaus we may need info when gatthering signers
            variable_name = question['variable']
            answers[question['variable']] = question['answer']

            # Variables that identify signers end with "signer"
            if variable_name.find('signer') >= 0:
                if 'docusign_data' in question:
                    signer_data = question['docusign_data']
                    signer_data['name'] = answers[question['docusign_data']['name_variable']]
                    signer_data['email'] = question['answer']
                    signers_data.append(signer_data)

    try:
        s3_client = boto3.client('s3')
        document_buffer = io.BytesIO()
        s3_client.download_fileobj('lawing-documents', f'{last_version.filename}', document_buffer)
    except ClientError as e:
        logging.error(e)

    document_buffer.seek(0)
    base64_document = base64.b64encode(document_buffer.read()).decode('ascii')

    if len(signers_data) > 0:

        # create the DocuSign document object
        document = DocusignDocument(  
            document_base64 = base64_document, 
            name = 'Acordo Procon',
            file_extension = 'docx',
            document_id = 1
        )

        signers = []
        for index, signer_data in enumerate(signers_data):
            # Create the signer recipient model 
            signer = Signer( # The signer
                email = signer_data['email'], name = signer_data['name'], recipient_id = str(index + 1), routing_order = "1")

            # Create a sign_here tab (field on the document)
            sign_here = SignHere( # DocuSign SignHere field/tab 
                recipient_id = '1', tab_label = 'assine aqui',
                anchor_string = signer_data['anchor_string'],
                anchor_x_offset = signer_data['anchor_x_offset'],
                anchor_y_offset = signer_data['anchor_y_offset'],
                anchor_ignore_if_not_present = "false",
                anchor_units = "inches"
                )

            # Add the tabs model (including the sign_here tab) to the signer
            signer.tabs = Tabs(sign_here_tabs = [sign_here]) # The Tabs object wants arrays of the different field/tab types

            signers.append(signer)

        # Next, create the top level envelope definition and populate it.
        envelope_definition = EnvelopeDefinition(
            email_subject = "Acordo Procon",
            documents = [document], # The order in the docs array determines the order in the envelope
            recipients = Recipients(signers = signers), # The Recipients object wants arrays for each recipient type
            status = "sent" # requests that the envelope be created and sent.
        )
        
        # Ready to go: send the envelope request
        api_client = ApiClient()
        api_client.host = 'https://demo.docusign.net/restapi'
        api_client.set_default_header(
            "Authorization", 
            "Bearer " + os.getenv('DOCUSIGN_TOKEN')
            )

        envelope_api = EnvelopesApi(api_client)
        try:
            envelope_summary = envelope_api.create_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_definition=envelope_definition)
            result = jsonify({"envelope_id": envelope_summary.envelope_id})
        except Exception as e:
            logging.error(e)
            result = jsonify({'message': 'Error accessing docusign api.'}), 400

        # envelop_summary_2 = envelope_api.get_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_summary.envelope_id)

        return result
    else :
        return jsonify({'message': 'No signers.'}), 400
