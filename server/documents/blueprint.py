from flask import Blueprint
from app.models.documents import DocumentVersion
from flask import abort, jsonify
import boto3

documents_api = Blueprint('documents', __name__)

@documents_api.route('/<int:document_id>/download')
def download(document_id):

    if not document_id:
        abort(400, 'Missing document id')

    try:
        last_version = DocumentVersion.query.filter_by(document_id=document_id).order_by(DocumentVersion.version_number).first()
    except Exception as e:
        print(e)
        abort(404, 'Document not Found')

    s3_client = boto3.client('s3')
    document_url = s3_client.generate_presigned_url(
    'get_object',
    Params={
        'Bucket': 'lawing-documents',
        'Key': last_version.filename
        },
    ExpiresIn=180)

    return jsonify(document_url)
