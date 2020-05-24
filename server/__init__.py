import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_marshmallow import Marshmallow


application = Flask(__name__)
application.debug = True
application.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
application.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
CORS(application)

db = SQLAlchemy(application)
migrate = Migrate(application, db)
ma = Marshmallow(application)

from app.documents.blueprint import documents_api
from app.docusign.blueprint import docusign_api
from app.auth.blueprint import auth_api

application.register_blueprint(documents_api, url_prefix='/documents')
application.register_blueprint(docusign_api, url_prefix='/docusign')
application.register_blueprint(auth_api, url_prefix='/auth')

@application.route('/', methods=['GET'])
def welcome():
    return 'Welcome do Doing.law API'
    