from app import db


class Company(db.Model):
    __tablename__ = "company"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=False, nullable=False)

    # Has many
    users = db.relationship("User", back_populates="company")
    templates = db.relationship("DocumentTemplate", back_populates="company")
    documents = db.relationship("Document", back_populates="company")

    def __repr__(self):
        return "<Company %r>" % self.name
