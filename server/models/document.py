import db

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('Group.id'), nullable=True)
    name = db.Column(db.String(255), unique=False, nullable=False)
    filename = db.Column(db.String(255), unique=False, nullable=True)

    def __repr__(self):
        return '<Document %r>' % self.name