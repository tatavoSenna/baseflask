from app import db

class Client(db.Model):
    __tablename__ = 'client'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=False, nullable=False)

    def __repr__(self):
        return '<Client %r>' % self.name
        