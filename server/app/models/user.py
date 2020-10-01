from datetime import datetime
from app import db


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    sub = db.Column(db.String(128), unique=True, nullable=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), unique=False, nullable=True)
    surname = db.Column(db.String(255), unique=False, nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    company_id = db.Column(
        db.Integer, db.ForeignKey("company.id"), nullable=True)
    docusign_token = db.Column(db.String(700), unique=False, nullable=True)
    docusign_refresh_token = db.Column(
        db.String(700), unique=False, nullable=True)
    docusign_token_obtain_date = db.Column(
        db.DateTime, nullable=True, default=datetime.utcnow()
    )
    active = db.Column(db.Boolean, default=True, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="users")

    # Has many
    documents = db.relationship("Document", back_populates="user")
    participates_on = db.relationship(
        "ParticipatesOn", back_populates="users")

    def __repr__(self):
        return "<User %r>" % self.username


class Group(db.Model):
    __tablename__ = "group"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=False, nullable=True)
    company_id = db.Column(
        db.Integer, db.ForeignKey("company.id"), nullable=True)
    active = db.Column(db.Boolean, default=True, nullable=True)

    # Belongs to
    company = db.relationship("Company", back_populates="groups")

    # Has many
    participates_on = db.relationship(
        "ParticipatesOn", back_populates="groups")

    def __repr__(self):
        return "<Group %r>" % self.name


class ParticipatesOn(db.Model):
    __tablename__ = "participates_on"

    id = db.Column(db.Integer, primary_key=True)

    group_id = db.Column(
        db.Integer, db.ForeignKey("group.id"), nullable=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=True)

    # Belongs to
    users = db.relationship("User", back_populates="participates_on")
    groups = db.relationship("Group", back_populates="participates_on")
