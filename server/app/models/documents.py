import enum

from datetime import datetime

from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.dialects.postgresql.json import JSON
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.types import Boolean


from app import db


class DocumentTemplate(db.Model):
    __tablename__ = "document_template"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    company_id = db.Column(
        db.Integer, db.ForeignKey("company.id"), nullable=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow())
    textfile = db.Column(db.String(255), unique=False, nullable=True)
    workflow = db.Column(JSONB, unique=False, nullable=True)
    form = db.Column(JSONB, unique=False, nullable=True)
    signers = db.Column(JSONB, unique=False, nullable=True)
    text_type = db.Column(db.String(255), unique=False, nullable=True)
    variables = db.Column(JSONB, unique=False, nullable=True)
    filename = db.Column(db.String(255), unique=False, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="templates")
    user = db.relationship("User", back_populates="templates")

    # Has many
    documents = db.relationship("Document", back_populates="template")
    external_tokens = db.relationship(
        "ExternalToken", back_populates="template")

    def __repr__(self):
        return "<Document Template %r>" % self.name


class Document(db.Model):
    __tablename__ = "document"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(255), unique=False, nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey(
        "company.id"), nullable=False)
    document_template_id = db.Column(
        db.Integer, db.ForeignKey("document_template.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow())
    envelope = db.Column(db.String(255), unique=True, nullable=True)
    workflow = db.Column(JSON, nullable=True)
    variables = db.Column(JSON, nullable=True)
    versions = db.Column(JSON, nullable=True, default=["0"])
    signers = db.Column(JSON, nullable=True)
    form = db.Column(JSON, nullable=True)
    sent = db.Column(Boolean, nullable=True, default=False)
    signed = db.Column(Boolean, nullable=True, default=False)
    current_step = db.Column(db.String(255), nullable=True)
    text_type = db.Column(db.String(255), unique=False, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="documents")
    user = db.relationship("User", back_populates="documents")
    template = db.relationship("DocumentTemplate", back_populates="documents")

    # Has many


class ExternalToken(db.Model):
    __tablename__ = "external_token"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=False, nullable=True)
    document_template_id = db.Column(
        db.Integer, db.ForeignKey("document_template.id"), nullable=False
    )
    token = db.Column(db.String(255), unique=True, nullable=False)
    used = db.Column(Boolean, nullable=True, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # Belongs to
    template = db.relationship(
        "DocumentTemplate", back_populates="external_tokens")
    user = db.relationship("User", back_populates="external_tokens")
