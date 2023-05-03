import os
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration


env_tag = os.environ.get("ENVIRONMENT_TAG", None)
# if the ENVIRONMENT_TAG is not present in the os.environ
# then we consider the app to be running locally on a development machine
if env_tag:
    sentry_sdk.init(
        dsn=os.environ.get("SENTRY_DSN"),
        integrations=[FlaskIntegration()],
        traces_sample_rate=1.0 if env_tag == "develop" else 0.7,
        environment=env_tag,
    )
else:
    from dotenv import load_dotenv

    load_dotenv()


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get(
        "SQLALCHEMY_TRACK_MODIFICATIONS", False
    )
    DOCUSIGN_OAUTH_URI = os.environ.get("DOCUSIGN_OAUTH_URI")
    DOCUSIGN_WEBHOOK_URL = os.environ.get("DOCUSIGN_WEBHOOK_URL")

    CONVERTAPI_SECRET_KEY = os.environ.get("CONVERTAPI_SECRET_KEY")

    SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")

    HTMLTOPDF_API_URL = os.environ.get("HTMLTOPDF_API_URL")

    AWS_DEFAULT_REGION = os.environ.get("AWS_DEFAULT_REGION")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_COGNITO_USER_POOL_ID = os.environ.get("AWS_COGNITO_USER_POOL_ID")
    AWS_COGNITO_USER_POOL_CLIENT_ID = os.environ.get("AWS_COGNITO_USER_POOL_CLIENT_ID")
    AWS_COGNITO_DOMAIN = "dummyvalue"
    AWS_COGNITO_USER_POOL_CLIENT_SECRET = "dummyvalue"
    AWS_COGNITO_REDIRECT_URL = "dummyvalue"
    AWS_S3_DOCUMENTS_BUCKET = os.environ.get("AWS_S3_DOCUMENTS_BUCKET")
    AWS_S3_DOCUMENTS_ROOT = "documents"
    AWS_S3_TEMPLATES_ROOT = "templates"
    AWS_S3_COMPANY_ROOT = "company"
    AWS_S3_SIGNED_DOCUMENTS_ROOT = "signed_documents"
    SNS_NEWDOCUMENT_ARN = os.environ.get("SNS_NEWDOCUMENT_ARN")
    D4SIGN_API_DOCUMENT_WEBHOOK_URL = os.environ.get("D4SIGN_API_DOCUMENT_WEBHOOK_URL")
    D4SIGN_API_URL = os.environ.get("D4SIGN_API_URL")
    DOMAIN_URL = os.environ.get("DOMAIN_URL")
    STRIPE_API_SECRET_KEY = os.environ.get("STRIPE_API_SECRET_KEY")

    PAGE_DEFAULT = 1
    PER_PAGE_DEFAULT = 20


def init_dotenv(app):
    from flask_dotenv import DotEnv

    env = DotEnv()
    env_file = os.environ.get("ENV_FILE", os.path.join(os.getcwd(), ".env"))

    if os.path.isfile(env_file) is False:
        print("No .env file was found or ENV_FILE is not set")
        exit()

    env.init_app(app, env_file=env_file)
