from app import ma
from app.models.user import User 

class UserSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = ('password', 'docusign_token', 'docusign_refresh_token', 'docusign_token_obtain_date') 
        model = User
        include_fk = True
