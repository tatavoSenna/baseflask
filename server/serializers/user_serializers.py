from app import ma
from app.models.user import User 

class UserSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        exclude = ('password',) 
        model = User
        include_fk = True