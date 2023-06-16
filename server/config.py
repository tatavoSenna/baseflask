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


def init_dotenv(app):
    from flask_dotenv import DotEnv

    env = DotEnv()
    env_file = os.environ.get("ENV_FILE", os.path.join(os.getcwd(), ".env"))

    if os.path.isfile(env_file) is False:
        print("No .env file was found or ENV_FILE is not set")
        exit()

    env.init_app(app, env_file=env_file)
