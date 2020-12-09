"""empty message

Revision ID: 3e18fff71652
Revises: f7bbbedd6b47
Create Date: 2020-12-02 19:05:58.839747

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3e18fff71652'
down_revision = 'f7bbbedd6b47'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('document', 'envelope',
               existing_type=postgresql.JSON(astext_type=sa.Text()),
               type_=sa.String(length=255),
               existing_nullable=True)
    op.create_unique_constraint(None, 'document', ['envelope'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'document', type_='unique')
    op.alter_column('document', 'envelope',
               existing_type=sa.String(length=255),
               type_=postgresql.JSON(astext_type=sa.Text()),
               existing_nullable=True)
    # ### end Alembic commands ###
