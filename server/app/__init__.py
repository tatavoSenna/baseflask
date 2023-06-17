from flask import Flask, jsonify
from flask_cors import CORS


def bad_request(e):
    return jsonify({"error": e.description}), 400


def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object("config.Config")

    CORS(app)

    app.register_error_handler(400, bad_request)

    @app.route("/", methods=["GET"])
    def home():
        return "Welcome to the API"

    return app
