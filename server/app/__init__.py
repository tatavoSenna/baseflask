import os

from flask import Flask
from flask_awscognito import AWSCognitoAuthentication
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate, MigrateCommand
from flask_sqlalchemy import SQLAlchemy
from config import init_dotenv


db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
aws_auth = AWSCognitoAuthentication()

def create_app():
    app = Flask(__name__, instance_relative_config=False)

    if app.config['ENV'] != "production":
        init_dotenv(app)

    app.config.from_object('config.Config')

    CORS(app)
    db.init_app(app)
    migrate.init_app(app)
    ma.init_app(app)
    aws_auth.init_app(app)

    from app.users import remote

    from app.documents.blueprint import documents_api
    app.register_blueprint(documents_api, url_prefix='/documents')

    from app.docusign.blueprint import docusign_api
    app.register_blueprint(docusign_api, url_prefix='/docusign')

    from app.auth.blueprint import auth_api
    app.register_blueprint(auth_api, url_prefix='/auth')

    from app.users.blueprint import users_api
    app.register_blueprint(users_api, url_prefix='/users')

    @app.route('/', methods=['GET'])
    def welcome():
        return 'Welcome do Doing.law API'

    return app
