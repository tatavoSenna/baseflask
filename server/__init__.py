import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    application = Flask(__name__)
    application.debug = True
    application.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    application.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    CORS(application)

    db.init_app(application)

    return application
    