from app import ma
from app.models.company import Company, Webhook


class CompanySerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = (
            "docusign_secret_key",
            "d4sign_api_cryptkey",
            "d4sign_api_hmac_secret",
        )
        model = Company


class CompanyListSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Company
        include_relationships = False
        exclude = (
            "docusign_account_id",
            "docusign_integration_key",
            "docusign_secret_key",
        )


class WebhookSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = ("company_id",)
        model = Webhook
