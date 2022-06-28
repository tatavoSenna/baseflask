from sqlalchemy.dialects.postgresql.json import JSON
from datetime import datetime

from app import db
from app.models.fields import StringChoiceField


class InternalDatabase(db.Model):
    __tablename__ = "internal_database"
    __table_args__ = (db.UniqueConstraint("title", "company_id"),)

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=False)
    title = db.Column(db.String(255), unique=False, nullable=False)
    table_type = db.Column(
        StringChoiceField(["text", "table"]),
        server_default="text",
        nullable=False,
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    created_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # Belongs to
    company = db.relationship("Company", back_populates="internal_dbs")
    created_by = db.relationship("User", back_populates="internal_dbs")

    # Has many
    text_items = db.relationship(
        "TextItem", back_populates="internal_database", lazy="dynamic"
    )

    def __repr__(self):
        return "<InternalDatabase %r>" % self.title


class TextItem(db.Model):
    __tablename__ = "text_item"

    id = db.Column(db.Integer, primary_key=True)
    internal_database_id = db.Column(
        db.Integer, db.ForeignKey("internal_database.id"), nullable=False
    )
    description = db.Column(db.String(255), nullable=True)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    created_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # Belongs to
    internal_database = db.relationship("InternalDatabase", back_populates="text_items")
    created_by = db.relationship("User", back_populates="text_items")

    # Has many
    text_item_tags = db.relationship(
        "TextItemTag", back_populates="text_item", lazy="dynamic"
    )

    def __repr__(self):
        return "<TextItem %r>" % self.description


class TextItemTag(db.Model):
    __tablename__ = "text_item_tag"

    id = db.Column(db.Integer, primary_key=True)

    text_item_id = db.Column(db.Integer, db.ForeignKey("text_item.id"), nullable=True)
    tag_id = db.Column(db.Integer, db.ForeignKey("tag.id"), nullable=True)

    # Belongs to
    text_item = db.relationship("TextItem", back_populates="text_item_tags")
    tag = db.relationship("Tag", back_populates="text_item_tags")
