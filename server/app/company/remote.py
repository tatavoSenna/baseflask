import boto3
import io
from flask import current_app
import base64
 
class RemoteCompany:

    s3_client = boto3.client("s3")

    def upload_logo(self, company_id, logo_img_base64):
        remote_path = f'{company_id}/logo/logo.png'
        logo_img = base64.b64decode(logo_img_base64)
        logo_img_io = io.BytesIO(logo_img)

        self.s3_client.upload_fileobj(
            logo_img_io,
            current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
            remote_path
        )
        
        url = f'https://{current_app.config["AWS_S3_DOCUMENTS_BUCKET"]}.s3.amazonaws/{remote_path}' 
        return url
 
    def download_logo_url(self, company_id):
        logo_url = self.s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": current_app.config["AWS_S3_DOCUMENTS_BUCKET"],
                "Key": f'{company_id}/logo/logo.png'
            },
            ExpiresIn=3600,
        )
        return logo_url 
        