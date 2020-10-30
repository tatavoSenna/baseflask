from flask import Flask
from flask_awscognito import AWSCognitoAuthentication
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from config import init_dotenv
from jinja2 import Environment, PackageLoader, select_autoescape


db = SQLAlchemy()
migrate = Migrate(compare_type=True,)
ma = Marshmallow()
aws_auth = AWSCognitoAuthentication()
jinja_env = Environment(
    loader=PackageLoader('app', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)


def create_app():
    app = Flask(__name__, instance_relative_config=False)

    if app.config["ENV"] != "production":
        init_dotenv(app)

    app.config.from_object("config.Config")

    CORS(app)
    db.init_app(app)
    migrate.init_app(app)
    ma.init_app(app)
    aws_auth.init_app(app)

    from .users import remote

    from .documents.blueprint import documents_bp

    app.register_blueprint(documents_bp, url_prefix="/documents")

    from .docusign.blueprint import docusign_bp

    app.register_blueprint(docusign_bp, url_prefix="/docusign")

    from .auth.blueprint import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")

    from .users.blueprint import users_bp, groups_bp

    app.register_blueprint(users_bp, url_prefix="/users")

    app.register_blueprint(groups_bp, url_prefix="/groups")

    @app.route("/", methods=["GET"])
    def welcome():
        return "Welcome do Doing.law API"

    return app
