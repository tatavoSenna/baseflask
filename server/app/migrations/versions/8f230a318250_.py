"""empty message

Revision ID: 8f230a318250
Revises: 87dfe902a760
Create Date: 2022-03-16 13:13:12.689490

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.orm.session import Session
from sqlalchemy.ext.automap import automap_base

Base = automap_base()

# revision identifiers, used by Alembic.
revision = "8f230a318250"
down_revision = "87dfe902a760"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    Base.prepare(autoload_with=bind)
    user_instance = Base.classes.user
    company_instance = Base.classes.company
    session = Session(bind=bind)
    m1s = session.query(company_instance).all()
    for m1 in m1s:
        m1.remaining_documents = 20
    m2s = session.query(user_instance).all()
    for m2 in m2s:
        m2.is_financial = True
    session.commit()
    pass


def downgrade():
    pass
