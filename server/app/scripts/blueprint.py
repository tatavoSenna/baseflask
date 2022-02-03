from flask import Blueprint
from app import db
from app.models.documents import Document
from app.models.documents import DocumentTemplate
import copy

scripts_bp = Blueprint("scripts", __name__)


@scripts_bp.cli.command("change-label")
def change_label():
    """Change 'value' for 'label' key on all fields on all documents and templates."""

    def swap_label(table):
        for item in db.session.query(table).all():
            item.form = copy.deepcopy(item.form)
            tmpForm = item.form
            for page in tmpForm:
                for field in page["fields"]:
                    if field.get("value") != None:
                        field["label"] = field["value"]
                        field.pop("value", None)
            item.form = tmpForm
            db.session.add(item)

        db.session.commit()

    swap_label(Document)
    swap_label(DocumentTemplate)
