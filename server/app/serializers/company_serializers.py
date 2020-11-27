from app import ma
from app.models.company import Company

class CompanySerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "docusign_integration_key",
            "docusign_secret_key",
            "docusign_account_id"
        )
        model = Company