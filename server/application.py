from flask import jsonify, request, send_file, current_app as application
from functools import wraps
from docxtpl import DocxTemplate
from app.requests import get_user, get_documents, get_logs, create_log
from app.constants import months
import jwt
import io
import json
import datetime
from app import db, create_app

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
    document = content['document']
    questions = content['questions']

    if not document or not questions:
        return jsonify({'message': 'Value is missing.'}), 404

    response = get_documents(current_user['group_id'], document)

    if not response:
        return jsonify({'message': 'Document is missing.'}), 404

    doc = DocxTemplate('template/%s.docx' % document)

    context = {}

    for question in questions:
        variable = None
        answer = None

        if "variable" in question:
            variable = question["variable"]

        if "answer" in question:
            answer = question["answer"]

        if variable and answer:
            context[variable] = answer

    context = add_variables(context)

    doc.render(context)

    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)

    create_log(current_user['group_id'], current_user['id'], document.id, questions)

    return send_file(
        buffer,
        as_attachment=True,
        attachment_filename="")


if __name__ == '__main__':
    application.run(debug=True)
