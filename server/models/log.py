from app import db 
from datetime import datetime

class Log(db.Model):
    __tablename__ = 'log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('Group.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('Document.id'), nullable=False)
    questions = db.Column(db.Text, unique=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    