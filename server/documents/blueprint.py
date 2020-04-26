from flask import Blueprint
from flask import abort, jsonify
import boto3

from app.models.documents import Document, DocumentVersion
from app.auth.services import check_for_token
from app.serializers.document_serializers import DocumentSerializer

documents_api = Blueprint('documents', __name__)

@documents_api.route('/')
@check_for_token
def get_document_list(current_user):
    client_documents_list = Document.query.filter_by(client_id=current_user['client_id']).order_by(Document.created_at)
    return jsonify(DocumentSerializer(many=True).dump(client_documents_list))

@documents_api.route('/<int:document_id>/download')
@check_for_token
def download(current_user, document_id):

    if not document_id:
        abort(400, 'Missing document id')

    try:
        last_version = DocumentVersion.query.filter_by(document_id=document_id).joinedload(DocumentVersion.document).order_by(DocumentVersion.version_number).first()
    except Exception as e:
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
