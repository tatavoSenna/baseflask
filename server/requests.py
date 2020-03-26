import json
from app.models.user import User
from app.models.document import Document
from app.models.log import Log
from app import db 

def get_user(email):
    user = User.query.filter_by(email=email).first()

    data = {
        "id": user.id,
        "name": user.name,
        "surname": user.surname,
        "group_id": user.group_id,
    }

    return data

def get_documents(group_id, *doc_id):
    if doc_id:
        documents = Document.query.filter_by(group_id=group_id, id=doc_id).all()
    else:
        documents = Document.query.filter_by(group_id=group_id).all()
        
    data = []
    for document in documents:
        data.append(
            {
            "id": document.id,
            "group_id": document.group_id,
            "name": document.name,
            "filename": document.filename,
            }
        )

    return data

def get_logs(group_id):
    logs = Log.query.filter_by(group_id=group_id).join(Document, Log.document_id==Document.id).order_by(Log.created_at.desc()).limit(5)

    data = []
    for log in logs:
        document = Document.query.get(log.document_id)
        data.append(
            {
            "id": log.id,
            "group_id": log.group_id,
            "user_id": log.user_id,
            "document_id": log.document_id,
            "questions": log.questions,
            "created_at": log.created_at,
            "name": document.name,
            "filename": document.filename,
            }
        )

    return data

def create_log(group_id, user_id, document_id, questions):
    log = Log('user_id', 'group_id', 'document_id', 'questions')
    db.session.add(log)
    db.session.commit()
    