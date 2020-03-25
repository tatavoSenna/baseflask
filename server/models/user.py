import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    surname = db.Column(db.String(255), unique=False, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), unique=False, nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('Group.id'), nullable=True)

    def __repr__(self):
        return '<User %r>' % self.name