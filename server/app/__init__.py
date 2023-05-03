from flask import Flask, jsonify
from flask_awscognito import AWSCognitoAuthentication
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from config import init_dotenv
from jinja2 import Environment, PackageLoader, environment, select_autoescape
import click
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
import os

db = SQLAlchemy()
migrate = Migrate(
    compare_type=True,
)
ma = Marshmallow()
aws_auth = AWSCognitoAuthentication()
jinja_env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(["html", "xml"]),
)


def bad_request(e):
    return jsonify({"error": e.description}), 400


def create_app():
    env_tag = os.environ.get("ENVIRONMENT_TAG", None)
    if env_tag and env_tag != "local":
        sentry_sdk.init(
            dsn=os.environ.get("SENTRY_DSN"),
            integrations=[FlaskIntegration()],
            traces_sample_rate=1.0 if env_tag == "develop" else 0.7,
            environment=env_tag,
        )
    else:
        init_dotenv(app)

    app = Flask(__name__, instance_relative_config=False)

    app.config.from_object("config.Config")

    CORS(app)
    db.init_app(app)
    migrate.init_app(app)
    ma.init_app(app)
    aws_auth.init_app(app)

    app.register_error_handler(400, bad_request)

    from .users import remote

    from .documents.blueprint import documents_bp

    app.register_blueprint(documents_bp, url_prefix="/documents")

    from .docusign.blueprint import docusign_bp

    app.register_blueprint(docusign_bp, url_prefix="/docusign")

    from .users.blueprint import users_bp, groups_bp

    app.register_blueprint(users_bp, url_prefix="/users")

    app.register_blueprint(groups_bp, url_prefix="/groups")

    from .company.blueprint import company_bp

    app.register_blueprint(company_bp, url_prefix="/company")

    from .templates.blueprint import templates_bp

    app.register_blueprint(templates_bp, url_prefix="/templates")

    from .external.blueprint import external_bp

    app.register_blueprint(external_bp, url_prefix="/external")

    @app.route("/", methods=["GET"])
    def welcome():
        with sentry_sdk.configure_scope() as scope:
            if scope.transaction:
                scope.transaction.sampled = False
        return "Welcome to Doing.law API"

    from .scripts.blueprint import scripts_bp

    app.register_blueprint(scripts_bp)

    from .d4sign.blueprint import d4sign_bp

    app.register_blueprint(d4sign_bp, url_prefix="/d4sign")

    from .internal_database.blueprint import internal_db_bp

    app.register_blueprint(internal_db_bp, url_prefix="/internaldbs")

    return app
