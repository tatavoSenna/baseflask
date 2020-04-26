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
    