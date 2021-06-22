from app import ma
from app.models.company import Company


class CompanySerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "docusign_secret_key",
        )
        model = Company

class CompanyListSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        include_relationships = False
        exclude = (
            'docusign_account_id',
            'docusign_integration_key',
            'docusign_secret_key',
        )
