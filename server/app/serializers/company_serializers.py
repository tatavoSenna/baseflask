from app import ma
from app.models.company import Company


class CompanySerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "docusign_secret_key",
        )
        model = Company
