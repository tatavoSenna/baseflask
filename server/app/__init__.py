import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config.from_pyfile('config.py')

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
