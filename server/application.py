from flask import jsonify, request, send_file, current_app as application
import boto3
from botocore.exceptions import ClientError
from functools import wraps
from docxtpl import DocxTemplate
from app.requests import get_user, get_documents, get_logs, create_log
from app.constants import months
import jwt
import io
import json
import datetime
from app import db, create_app
import os
import base64
from docusign_esign import ApiClient, EnvelopesApi, EnvelopeDefinition, Signer, SignHere, Tabs, Recipients, Document

application = create_app()

def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        token = request.headers.get('X-Auth-Token')

        if not token:
            return jsonify({'message': 'Token is missing.'}), 403

        try:
            data = jwt.decode(token, application.config['SECRET_KEY'])
        except Exception as error:
            return jsonify({'message': 'Token is invalid.'}), 403

        return func(data, *args, **kwargs)

    return wrapped


def add_variables(context):
    # Add day, month and year
    now = datetime.datetime.now()

    context['day'] = str(now.day).zfill(2)
    context['month'] = months[now.month - 1]
    context['year'] = now.year

    return context


@application.route('/', methods=['GET'])
def welcome():
    return 'Welcome do Doing.law API'


@application.route('/login', methods=['POST'])
def login():
    content = request.json
    email = content['email']
    password = content['password']

    if not email or not password:
        return jsonify({'message': 'Value is missing.'}), 404

    user = get_user(email)

    if user:
        token = jwt.encode(user, application.config['SECRET_KEY'])

        return jsonify({'token': token.decode('UTF-8'), 'user': user})

    return jsonify({'message': 'Cannot be authenticated.'}), 401


@application.route('/documents', methods=['GET'])
@check_for_token
def documents(current_user):

    documents = get_documents(current_user['group_id'])

    return jsonify(documents)


@application.route('/logs', methods=['GET'])
@check_for_token
def logs(current_user):

    logs = get_logs(current_user['group_id'])

    return jsonify(logs)


@application.route('/questions', methods=['GET'])
@check_for_token
def questions(current_user):
    document = request.args.get('document')

    if not document:
        return jsonify({'message': 'Value is missing.'}), 404

    with open('questions/%s.json' % document, encoding='utf-8') as json_file:
        questions = json.load(json_file)

        return jsonify(questions)


@application.route('/create', methods=['POST'])
@check_for_token
def create(current_user):
    content = request.json
    document_id = content['document']
    questions = content['questions']

    if not document_id or not questions:
        return jsonify({'message': 'Value is missing.'}), 404

    response = get_documents(current_user['group_id'], document_id)

    if not response:
        return jsonify({'message': 'Document is missing.'}), 404

    doc = DocxTemplate('template/%s.docx' % document_id)

    context = {}
    signers_data = []

    for question in questions:
        variable = None
        answer = None

        if 'variable' in question:
            variable = question['variable']

        if 'answer' in question:
            answer = question['answer']

        if variable and answer:
            context[variable] = answer
            if variable.find('signer') >= 0:
                if 'docusign_data' in question:
                    signer_data = question['docusign_data']
                    signer_data['name'] = context[question['docusign_data']['name_variable']]
                    signer_data['email'] = question['answer']

                    if variable == 'witness_1_signer':
                        signer_data['anchor_x_offset'] = '0'
                        signer_data['anchor_y_offset'] = '0.2'
                    if variable == 'witness_2_signer':
                        signer_data['anchor_x_offset'] = '3.2'
                        signer_data['anchor_y_offset'] = '0.2'
                    
                    signers_data.append(signer_data)

    context = add_variables(context)

    doc.render(context)

    document_buffer = io.BytesIO()
    doc.save(document_buffer)
    document_buffer.seek(0)

    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_fileobj(document_buffer, 'lawing-documents', 'testfile2.docx')
    except ClientError as e:
        print('error uploading to s3')

    try:
        document_buffer = io.BytesIO()
        s3_client.download_fileobj('lawing-documents', 'testfile2.docx', document_buffer)
    except ClientError as e:
        print(e)

    document_buffer.seek(0)
    base64_document = base64.b64encode(document_buffer.read()).decode('ascii')

    if len(signers_data) > 0:
        
        # create the DocuSign document object
        document = Document(  
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
            "Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU4NjEwNTAzMCwiZXhwIjoxNTg2MTMzODMwLCJVc2VySWQiOiIzZDYyODY4Yy04Yjg4LTQ2NTMtYTU0Ny00MjY3MTY2MWI2NzQiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiM2Q2Mjg2OGMtOGI4OC00NjUzLWE1NDctNDI2NzE2NjFiNjc0IiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU4NjEwNTAyNywicHdpZCI6Ijc2NTA4ZTdjLTU0NmEtNDZmZS1hMDUxLWViMGI5ODFhMmQwZSJ9.3JAKYbnYiKxYMMjCavQsvEPoic4FC88vnCHNbgYPIRked-NB3k1rNpaPF73Xf5FyaOJWYEcAADCQnryZwdTuoULQ0wAbCEYenvOIUfOR4yiKG889qlYKJxajcuyJPtFU6Ej9_tT72hoa_UWJL_W6C132t2YMd0iDgwbS3zsPj5mc5xo03VLUe8oryqbXw5tasfVOHEvY2XAsNN61GPpV58akEmv_hXl5dVhapDD08lLXQHnCvqJl1nhnm0UxPijvW9zCOCmJt7Tnx8Qk6EQ-DKezUT6kLrceOJuWQRpXTnj2uBQYe7oJ63dN21yEPE_kngEKadaXG-W9fbTLYT5QhQ'
            )

        envelope_api = EnvelopesApi(api_client)
        results = envelope_api.create_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_definition=envelope_definition)
    
    create_log(current_user['group_id'], current_user['id'], document_id, questions)

    buffer_document = io.BytesIO()
    doc.save(buffer_document)
    buffer_document.seek(0)
    return send_file(
        buffer_document,
        as_attachment=True,
        attachment_filename="")


if __name__ == '__main__':
    application.run(debug=True)
