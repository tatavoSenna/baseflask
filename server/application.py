from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from functools import wraps
from docxtpl import DocxTemplate
from requests import get_user, get_documents, get_logs, create_log
from constants import months
import jwt
import io
import json
import datetime

mysql = MySQL(cursorclass=DictCursor)
application = Flask(__name__)
application.debug = True
application.config['SECRET_KEY'] = 'nevergiveup!'
CORS(application)

application.config['MYSQL_DATABASE_USER'] = 'lawing_local'
application.config['MYSQL_DATABASE_PASSWORD'] = 'hf8JGTRD'
application.config['MYSQL_DATABASE_DB'] = 'lawing_local'
application.config['MYSQL_DATABASE_HOST'] = 'mysql'

mysql.init_app(application)
conn = mysql.connect()
cursor = conn.cursor()


def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):
        token = request.headers.get('X-Auth-Token')

        if not token:
            return jsonify({'message': 'Token is missing.'}), 403

        try:
            data = jwt.decode(token, application.config['SECRET_KEY'])
        except Exception as error:
            print(error)
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
    print(email)
    print(password)
    user = get_user(mysql, email, password)
    print(user)

    if user:
        token = jwt.encode(user[0], application.config['SECRET_KEY'])

        return jsonify({'token': token.decode('UTF-8'), 'user': user[0]})

    return jsonify({'message': 'Cannot be authenticated.'}), 401


@application.route('/documents', methods=['GET'])
@check_for_token
def documents(current_user):
    documents = get_documents(mysql, current_user['group_id'])

    return jsonify(documents)


@application.route('/logs', methods=['GET'])
@check_for_token
def logs(current_user):
    logs = get_logs(mysql, current_user['group_id'])

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

    response = get_documents(mysql, current_user['group_id'], document)

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

    print(context)

    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)

    create_log(mysql, current_user['group_id'], current_user['id'], document, questions)

    return send_file(
        buffer,
        as_attachment=True,
        attachment_filename="")


if __name__ == '__main__':
    application.run(debug=True)
