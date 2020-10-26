"""empty message

Revision ID: 075253f0ded6
Revises: 25335642fb41
Create Date: 2020-10-23 14:24:30.364200

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '075253f0ded6'
down_revision = '25335642fb41'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('document', sa.Column('form', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('document', 'form')
    # ### end Alembic commands ###
