from flask import request, Blueprint, jsonify, current_app
from werkzeug.exceptions import BadRequest, NotFound, Forbidden

from app.users.remote import authenticated_user
from app.serializers.internal_database import *
from app.internal_database.controllers import *

internal_db_bp = Blueprint("internaldbs", __name__)


# Get specific internal db based on id
@internal_db_bp.route("/<int:db_id>", methods=["GET"])
@authenticated_user
def get_internal_db_detail(current_user, db_id):
    try:
        internal_db = get_internal_db_controller(current_user, db_id)
    except NotFound as e:
        return jsonify({"Database not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Database"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(InternalDBSerializer(many=False).dump(internal_db)), 200


# List all internal dbs
@internal_db_bp.route("/", methods=["GET"])
@authenticated_user
def list_internal_dbs(current_user):
    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_term = str(request.args.get("search", ""))

        order_by = str(request.args.get("order_by", "created_at"))
        order = str(request.args.get("order", "descend"))
    except Exception as e:
        return BadRequest(description="Malformed parameters")

    internal_db_query = list_internal_db_controller(
        current_user, page, per_page, search_term, order_by, order
    )

    return (
        jsonify(
            {
                "page": internal_db_query.page,
                "per_page": internal_db_query.per_page,
                "total": internal_db_query.total,
                "items": InternalDBListSerializer(many=True).dump(
                    internal_db_query.items
                ),
            }
        ),
        200,
    )


# List all text items based on internal db id
@internal_db_bp.route("/<int:db_id>/textitems", methods=["GET"])
@authenticated_user
def list_text_items_from_internal_db(current_user, db_id):
    try:
        page = int(request.args.get("page", current_app.config["PAGE_DEFAULT"]))
        per_page = int(
            request.args.get("per_page", current_app.config["PER_PAGE_DEFAULT"])
        )
        search_term = str(request.args.get("search", ""))

        order_by = str(request.args.get("order_by", "created_at"))
        order = str(request.args.get("order", "descend"))
    except Exception as e:
        return BadRequest(description="Malformed parameters")

    text_items_query = list_text_items_from_internal_db_controller(
        current_user, db_id, page, per_page, search_term, order_by, order
    )

    if not text_items_query:
        return (
            jsonify(
                {
                    "page": page,
                    "per_page": per_page,
                    "total": 0,
                    "items": [],
                }
            ),
            200,
        )

    return (
        jsonify(
            {
                "page": text_items_query.page,
                "per_page": text_items_query.per_page,
                "total": text_items_query.total,
                "items": TextItemListSerializer(many=True).dump(text_items_query.items),
            }
        ),
        200,
    )


# Create internal db
@internal_db_bp.route("/", methods=["POST"])
@authenticated_user
def create_internal_db(current_user):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    try:
        internal_db = create_internal_db_controller(current_user, request.json)
    except BadRequest as e:
        return jsonify({"Missing title"}), 400
    except NotFound as e:
        return jsonify({"Database not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Database"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(InternalDBSerializer(many=False).dump(internal_db)), 201


# Update internal db title
@internal_db_bp.route("/<int:db_id>", methods=["PATCH"])
@authenticated_user
def update_internal_db(current_user, db_id):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    try:
        internal_db = update_internal_db_controller(current_user, request.json, db_id)
    except BadRequest as e:
        return jsonify({"Missing title"}), 400
    except NotFound as e:
        return jsonify({"Database not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Database"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(InternalDBSerializer(many=False).dump(internal_db)), 200


# Delete internal db if there is no item linked to it
@internal_db_bp.route("/<int:db_id>", methods=["DELETE"])
@authenticated_user
def delete_internal_db(current_user, db_id):
    try:
        delete_internal_db_controller(current_user, db_id)
    except NotFound as e:
        return jsonify({"Database not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Database"}), 403
    except BadRequest as e:
        return jsonify({"Cannot delete Database with items"}), 400
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify({}), 200


# Get specific text item based on id
@internal_db_bp.route("/textitem/<int:text_item_id>", methods=["GET"])
@authenticated_user
def get_text_item_detail(current_user, text_item_id):
    try:
        text_item = get_text_item_controller(current_user, text_item_id)
    except NotFound as e:
        return jsonify({"Text item not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Text item"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(InternalDBSerializer(many=False).dump(text_item)), 200


# Create text item related to internal db
@internal_db_bp.route("/textitem", methods=["POST"])
@authenticated_user
def create_text_item(current_user):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    try:
        text_item = create_text_item_controller(current_user, request.json)
    except BadRequest as e:
        return jsonify({"Missing fields"}), 400
    except NotFound as e:
        return jsonify({"Database not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Database"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(TextItemSerializer(many=False).dump(text_item)), 201


# Update text item based on item id
@internal_db_bp.route("/textitem/<int:text_item_id>", methods=["PATCH"])
@authenticated_user
def update_text_item(current_user, text_item_id):
    if not request.is_json:
        return jsonify({"message": "Accepts only content-type json."}), 400

    try:
        text_item = update_text_item_controller(
            current_user, text_item_id, request.json
        )
    except BadRequest as e:
        return jsonify({"Missing fields"}), 400
    except NotFound as e:
        return jsonify({"Text item not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Text item"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify(TextItemSerializer(many=False).dump(text_item)), 200


# Delete text item and relations text-tag
@internal_db_bp.route("/textitem/<int:text_item_id>", methods=["DELETE"])
@authenticated_user
def delete_text_item(current_user, text_item_id):
    try:
        delete_text_item_controller(current_user, text_item_id)
    except NotFound as e:
        return jsonify({"Text item not found"}), 404
    except Forbidden as e:
        return jsonify({"User does not have access to this Text item"}), 403
    except Exception as e:
        return jsonify({"Internal Error"}), 500

    return jsonify({}), 200
