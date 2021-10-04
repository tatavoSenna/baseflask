from sqlalchemy.dialects.postgresql.json import JSON

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

    signatures_provider = db.Column(
        StringChoiceField(['docusign', 'd4sign']),
        server_default='docusign',
        nullable=True
    )

    d4sign_api_token = db.Column(db.String(255), nullable=True)
    d4sign_api_cryptkey = db.Column(db.String(255), nullable=True)
    d4sign_api_hmac_secret = db.Column(db.String(255), nullable=True)  # authorizes webhook calls
    d4sign_safe_name = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return "<Company %r>" % self.name

class Webhook(db.Model):
    __tablename__ = "webhook"

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(
        db.Integer, db.ForeignKey("company.id"), nullable=True)
    webhook = db.Column(db.String(1500), unique=True, nullable=True)
    pdf = db.Column(db.Boolean, default=False, nullable=True)
    docx = db.Column(db.Boolean, default=False, nullable=True)

    def __repr__(self):
        return "<Webhook %r>" % self.webhook