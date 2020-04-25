from datetime import datetime
import logging
from flask import jsonify, request, send_file, current_app as application
import boto3
from botocore.exceptions import ClientError
from functools import wraps
from docxtpl import DocxTemplate
from app.requests import get_user, get_document_models, get_documents, create_document
from app.constants import months
import jwt
import io
import json
import datetime
from app import db, create_app
import os
import base64
from slugify import slugify
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

    document_models = get_document_models(current_user['client_id'])

    return jsonify(document_models)


@application.route('/logs', methods=['GET'])
@check_for_token
def logs(current_user):

    documents = get_documents(current_user['client_id'])

    return jsonify(documents)


@application.route('/questions', methods=['GET'])
@check_for_token
def questions(current_user):
    # TODO: change parameter to 'model'
    document_model = request.args.get('document')

    if not document_model:
        return jsonify({'message': 'Value is missing.'}), 404

    with open('questions/%s.json' % document_model, encoding='utf-8') as json_file:
        decision_tree = json.load(json_file)

    # Initialize the decision tree with the title input field
    augumented_decision_tree = [{
            "label": "",
            "variable": "title",
            "option": "",
            "type": "input",
            "value": "Qual o título do Documento?",
            "answer": "",
            "parentIndex": None,
            "childIndex": 1
        }]
    
    for field in decision_tree:
        print(field)
        field['parentIndex'] = 0 if field['parentIndex'] == None else field['parentIndex'] + 1
        if 'childIndex' in field and field['childIndex']:
            field['childIndex'] = field['childIndex'] +  1
        augumented_decision_tree.append(field)

    return jsonify(augumented_decision_tree)


@application.route('/create', methods=['POST'])
@check_for_token
def create(current_user):
    content = request.json
    document_model_id = content['document']
    questions = content['questions']

    if not document_model_id or not questions:
        return jsonify({'message': 'Value is missing.'}), 404

    # get and validate the document type
    document_model = get_document_models(current_user['client_id'], document_model_id)
    print(document_model)
    if not document_model:
        return jsonify({'message': 'Document model is missing.'}), 404

    # get the decision tree 
    doc = DocxTemplate('template/%s.docx' % document_model_id)

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

            # creates the filename from the document_title
            s3_object_key = slugify(document_model.filename)
            if variable['variale'] == 'title':
                s3_object_key = slugify(question['variable'])
            s3_object_key = f'{s3_object_key}_{datetime.now().timestamp()}'

            # Look for signers
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
        response = s3_client.upload_fileobj(document_buffer, 'lawing-documents', '  ')
    except ClientError as e:
        print('error uploading to s3')

    try:
        document_buffer = io.BytesIO()
        s3_client.download_fileobj('lawing-documents', f'{s3_object_key}.docx', document_buffer)
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
            "Bearer " + os.getenv('DOCUSIGN_TOKEN')
            )

        envelope_api = EnvelopesApi(api_client)
        try:
            results = envelope_api.create_envelope('957b17e7-1218-4865-8fff-ad974ed8f6a7', envelope_definition=envelope_definition)
        except Exception as e:
            logging.error(e)

    document_url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': 'lawing-documents',
            'Key': 'testfile2.docx'
            },
        ExpiresIn=180)

    new_document = create_document(current_user['client_id'], current_user['id'], document_model_id, questions, document_url)   
    
    return jsonify(document_url)

if __name__ == '__main__':
    application.run(debug=True)
