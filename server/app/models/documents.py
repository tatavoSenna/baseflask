import enum
from app import db
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql.json import JSON
from sqlalchemy.dialects.postgresql import ENUM

class DocumentModel(db.Model):
    __tablename__ = 'document_model'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    filename = db.Column(db.String(255), unique=False, nullable=True)
    model_type = db.Column(
        ENUM('docx', 'pdf', name='model_template_file_type'),
        default= 'docx',
        nullable=False
    )

    def __repr__(self):
        return '<Document Model %r>' % self.name

class Document(db.Model):
    __tablename__ = 'document'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), unique=True, nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    document_model_id = db.Column(db.Integer, db.ForeignKey('document_model.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    user = relationship('User')
    envelope = db.Column(JSON, nullable=True)

    versions = relationship('DocumentVersion', back_populates='document')
    model = relationship('DocumentModel')

class DocumentVersion(db.Model):
    __tablename__ = 'document_version'

    id = db.Column(db.Integer, primary_key=True)
    version_number = db.Column(db.Integer, default=1)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    filename = db.Column(db.String(255), unique=False, nullable=True)
    answers = db.Column(JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())

    document = relationship('Document', back_populates='versions')
