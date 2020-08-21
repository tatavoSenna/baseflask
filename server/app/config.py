import os
from app import app

if app.config['ENV'] != "production":
    init_dotenv()

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = os.environ.get("SQLALCHEMY_TRACK_MODIFICATIONS", False)
app.config["DOCUSIGN_OAUTH_URI"] = os.environ.get("DOCUSIGN_OAUTH_URI")
app.config["DOCUSIGN_INTEGRATION_KEY"] = os.environ.get("DOCUSIGN_INTEGRATION_KEY")
app.config["DOCUSIGN_SECRET_KEY"] = os.environ.get("DOCUSIGN_SECRET_KEY")
app.config["AWS_DEFAULT_REGION"] = os.environ.get("AWS_DEFAULT_REGION")
app.config["AWS_ACCESS_KEY_ID"] = os.environ.get("AWS_ACCESS_KEY_ID")
app.config["AWS_SECRET_ACCESS_KEY"] = os.environ.get("AWS_SECRET_ACCESS_KEY")
app.config["AWS_COGNITO_DOMAIN"] = os.environ.get("AWS_COGNITO_DOMAIN")
app.config["AWS_COGNITO_USER_POOL_ID"] = os.environ.get("AWS_COGNITO_USER_POOL_ID")
app.config["AWS_COGNITO_USER_POOL_CLIENT_ID"] = os.environ.get("AWS_COGNITO_USER_POOL_CLIENT_ID")
app.config["AWS_COGNITO_USER_POOL_CLIENT_SECRET"] = os.environ.get("AWS_COGNITO_USER_POOL_CLIENT_SECRET")
app.config["AWS_COGNITO_REDIRECT_URL"] = os.environ.get("AWS_COGNITO_REDIRECT_URL")

def init_dotenv():
    from flask_dotenv import DotEnv

    env = DotEnv()
    env_file = os.environ.get("ENV_FILE", os.path.join(os.getcwd(), '.env'))

    if os.path.isfile(env_file) is False:
        print("No .env file was found or ENV_FILE is not set")
        exit()

    env.init_app(app, env_file=env_file)
