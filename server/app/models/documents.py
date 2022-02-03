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
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    textfile = db.Column(db.String(255), unique=False, nullable=True)
    workflow = db.Column(JSONB, unique=False, nullable=True)
    form = db.Column(JSONB, unique=False, nullable=True)
    signers = db.Column(JSONB, unique=False, nullable=True)
    text_type = db.Column(db.String(255), unique=False, nullable=True)
    variables = db.Column(JSONB, unique=False, nullable=True)
    filename = db.Column(db.String(255), unique=False, nullable=True)
    published = db.Column(db.Boolean, default=False, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="templates")
    user = db.relationship("User", back_populates="templates")

    # Has many
    documents = db.relationship("Document", back_populates="template")
    external_tokens = db.relationship("ExternalToken", back_populates="template")

    def __repr__(self):
        return "<Document Template %r>" % self.name


class Document(db.Model):
    __tablename__ = "document"

    id = db.Column(db.Integer, primary_key=True)
    is_folder = db.Column(
        db.Boolean, nullable=False, default=False, server_default="false"
    )
    parent_id = db.Column(
        db.Integer, db.ForeignKey("document.id"), unique=False, nullable=True
    )
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(255), unique=False, nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=False)
    document_template_id = db.Column(
        db.Integer, db.ForeignKey("document_template.id"), nullable=True
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    envelope = db.Column(db.String(255), unique=True, nullable=True)
    workflow = db.Column(JSON, nullable=True)
    variables = db.Column(JSON, nullable=True)
    data_assinatura = db.Column(db.Date, nullable=True)
    nome_contrato = db.Column(db.String(255), nullable=True)
    valor_contrato = db.Column(db.String(255), nullable=True)
    data_inicio_contrato = db.Column(db.Date, nullable=True)
    data_final_contrato = db.Column(db.Date, nullable=True)
    versions = db.Column(JSON, nullable=True, default=["0"])
    signers = db.Column(JSON, nullable=True)
    form = db.Column(JSON, nullable=True)
    sent = db.Column(Boolean, nullable=True, default=False)
    signed = db.Column(Boolean, nullable=True, default=False)
    current_step = db.Column(db.String(255), nullable=True)
    text_type = db.Column(db.String(255), unique=False, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)

    d4sign_document_uuid = db.Column(db.String(255), unique=True, nullable=True)

    d4sign_document_uuid = db.Column(db.String(255), unique=True, nullable=True)

    d4sign_document_uuid = db.Column(db.String(255), unique=True, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="documents")
    user = db.relationship("User", back_populates="documents")
    template = db.relationship("DocumentTemplate", back_populates="documents")
    parent = db.relationship("Document", remote_side=[id])

    # Has many


class ExternalToken(db.Model):
    __tablename__ = "external_token"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=False, nullable=True)
    document_template_id = db.Column(
        db.Integer, db.ForeignKey("document_template.id"), nullable=False
    )
    token = db.Column(db.String(255), unique=True, nullable=False)
    max_uses = db.Column(db.Integer, unique=False, nullable=False, server_default="0")
    current_uses = db.Column(
        db.Integer, unique=False, nullable=False, server_default="0"
    )
    used = db.Column(Boolean, nullable=True, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    # Belongs to
    template = db.relationship("DocumentTemplate", back_populates="external_tokens")
    user = db.relationship("User", back_populates="external_tokens")
