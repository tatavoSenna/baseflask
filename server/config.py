import os


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = os.environ.get(
        "SQLALCHEMY_TRACK_MODIFICATIONS", False
    )
    DOCUSIGN_OAUTH_URI = os.environ.get("DOCUSIGN_OAUTH_URI")
    DOCUSIGN_WEBHOOK_URL = os.environ.get("DOCUSIGN_WEBHOOK_URL")

    SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")

    AWS_DEFAULT_REGION = os.environ.get("AWS_DEFAULT_REGION")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_COGNITO_DOMAIN = os.environ.get("AWS_COGNITO_DOMAIN")
    AWS_COGNITO_USER_POOL_ID = os.environ.get("AWS_COGNITO_USER_POOL_ID")
    AWS_COGNITO_USER_POOL_CLIENT_ID = os.environ.get(
        "AWS_COGNITO_USER_POOL_CLIENT_ID")
    AWS_COGNITO_USER_POOL_CLIENT_SECRET = os.environ.get(
        "AWS_COGNITO_USER_POOL_CLIENT_SECRET"
    )
    AWS_COGNITO_REDIRECT_URL = os.environ.get("AWS_COGNITO_REDIRECT_URL")
    AWS_S3_DOCUMENTS_BUCKET = os.environ.get("AWS_S3_DOCUMENTS_BUCKET")
    AWS_S3_DOCUMENTS_ROOT = "documents"
    AWS_S3_TEMPLATES_ROOT = "templates"
    AWS_S3_SIGNED_DOCUMENTS_ROOT = "signed_documents"
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
