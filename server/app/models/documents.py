import enum

from datetime import datetime

from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.dialects.postgresql.json import JSON
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.orm import relationship

from app import db


class DocumentTemplate(db.Model):
    __tablename__ = "document_template"

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    textfile = db.Column(db.String(255), unique=False, nullable=True)
    workflow = db.Column(JSONB, unique=False, nullable=True)
    form = db.Column(JSONB, unique=False, nullable=True)
    signers = db.Column(JSONB, unique=False, nullable=True)
    filetype = db.Column(
        ENUM("docx", "pdf", name="template_file_type"), default="docx", nullable=False
    )
    # Belongs to
    company = db.relationship("Company", back_populates="templates")

    # Has many
    documents = db.relationship("Document", back_populates="template")

    def __repr__(self):
        return "<Document Template %r>" % self.name


class Document(db.Model):
    __tablename__ = "document"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(255), unique=True, nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"), nullable=False)
    document_template_id = db.Column(
        db.Integer, db.ForeignKey("document_template.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    envelope = db.Column(JSON, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="documents")
    user = relationship("User", back_populates="documents")
    template = relationship("DocumentTemplate", back_populates="documents")

    # Has many
    versions = relationship("DocumentVersion", back_populates="document")


class DocumentVersion(db.Model):
    __tablename__ = "document_version"

    id = db.Column(db.Integer, primary_key=True)
    version_number = db.Column(db.Integer, default=1)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"), nullable=False)
    filename = db.Column(db.String(255), unique=False, nullable=True)
    answers = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())

    # Belongs to
    document = relationship("Document", back_populates="versions")
