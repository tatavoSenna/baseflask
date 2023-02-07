from sqlalchemy.dialects.postgresql.json import JSON
from datetime import datetime

from app import db
from app.models.fields import StringChoiceField


class Company(db.Model):
    __tablename__ = "company"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    docusign_integration_key = db.Column(db.String(1500), unique=False, nullable=True)
    docusign_secret_key = db.Column(db.String(1500), unique=False, nullable=True)
    docusign_account_id = db.Column(db.String(1500), unique=False, nullable=True)

    # Has many
    users = db.relationship("User", back_populates="company")
    groups = db.relationship("Group", back_populates="company")
    templates = db.relationship("DocumentTemplate", back_populates="company")
    documents = db.relationship("Document", back_populates="company")
    internal_dbs = db.relationship(
        "InternalDatabase", back_populates="company", lazy="dynamic"
    )
    tags = db.relationship("Tag", back_populates="company", lazy="dynamic")

    signatures_provider = db.Column(
        StringChoiceField(["docusign", "d4sign"]),
        server_default="docusign",
        nullable=True,
    )

    d4sign_api_token = db.Column(db.String(255), nullable=True)
    d4sign_api_cryptkey = db.Column(db.String(255), nullable=True)
    d4sign_api_hmac_secret = db.Column(
        db.String(255), nullable=True
    )  # authorizes webhook calls
    d4sign_safe_name = db.Column(db.String(255), nullable=True)

    stripe_company_email = db.Column(db.String(255), nullable=True)
    remaining_documents = db.Column(db.Integer, nullable=False, server_default="20")
    base_document = db.Column(db.String(255), nullable=False, server_default="")

    def __repr__(self):
        return "<Company %r>" % self.name


class Webhook(db.Model):
    __tablename__ = "webhook"

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=True)
    webhook = db.Column(db.String(1500), unique=True, nullable=True)
    pdf = db.Column(db.Boolean, default=False, nullable=True)
    docx = db.Column(db.Boolean, default=False, nullable=True)

    def __repr__(self):
        return "<Webhook %r>" % self.webhook


class Tag(db.Model):
    __tablename__ = "tag"
    __table_args__ = (db.UniqueConstraint("title", "company_id"),)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=False, nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=False)
    config = db.Column(JSON, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    created_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # Belongs to
    company = db.relationship("Company", back_populates="tags")
    created_by = db.relationship("User", back_populates="tags")

    # Has many
    text_item_tags = db.relationship(
        "TextItemTag", back_populates="tag", lazy="dynamic"
    )

    def __repr__(self):
        return "<Tag %r>" % self.title
