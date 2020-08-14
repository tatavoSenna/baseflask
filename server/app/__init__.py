import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_marshmallow import Marshmallow

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')

app.config['AWS_DEFAULT_REGION'] = 'us-east-1'
app.config['AWS_COGNITO_DOMAIN'] = 'auth.lawing.com.br'
app.config['AWS_COGNITO_USER_POOL_ID'] = 'us-east-1_LRxGy9gu5'
app.config['AWS_COGNITO_USER_POOL_CLIENT_ID'] = '3mqfa8k59e3j08785ja7ec3iqs'
app.config['AWS_COGNITO_USER_POOL_CLIENT_SECRET'] = '1c41gi6mrm16ehqme6urbiiopsurf08ag06inchm24jghmovq3ka'
app.config['AWS_COGNITO_REDIRECT_URL'] = 'http://localhost:5000/auth/callback'

CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
ma = Marshmallow(app)

from app.documents.blueprint import documents_api
from app.docusign.blueprint import docusign_api
from app.auth.blueprint import auth_api

app.register_blueprint(documents_api, url_prefix='/documents')
app.register_blueprint(docusign_api, url_prefix='/docusign')
app.register_blueprint(auth_api, url_prefix='/auth')

@app.route('/', methods=['GET'])
def welcome():
    return 'Welcome do Doing.law API'
