"""Add user is_admin

Revision ID: cdd5d228480a
Revises: 436d341d1d5c
Create Date: 2021-06-06 19:50:52.864340

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'cdd5d228480a'
down_revision = '436d341d1d5c'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('is_admin', sa.Boolean(), nullable=True, default=False))


def downgrade():
    op.drop_column('user', 'is_admin')
