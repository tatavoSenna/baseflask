"""empty message

Revision ID: a2f17bdfcd58
Revises: 4ef1e8ce8c7f
Create Date: 2020-09-30 14:15:12.809359

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2f17bdfcd58'
down_revision = '4ef1e8ce8c7f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'docusign_refresh_token',
               existing_type=sa.VARCHAR(length=700),
               type_=sa.String(length=1500),
               existing_nullable=True)
    op.alter_column('user', 'docusign_token',
               existing_type=sa.VARCHAR(length=700),
               type_=sa.String(length=1500),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'docusign_token',
               existing_type=sa.String(length=1500),
               type_=sa.VARCHAR(length=700),
               existing_nullable=True)
    op.alter_column('user', 'docusign_refresh_token',
               existing_type=sa.String(length=1500),
               type_=sa.VARCHAR(length=700),
               existing_nullable=True)
    # ### end Alembic commands ###