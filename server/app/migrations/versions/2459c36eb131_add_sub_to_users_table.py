"""add sub to users table

Revision ID: 2459c36eb131
Revises: b0892bdb8b8e
Create Date: 2020-08-22 11:03:57.346273

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "2459c36eb131"
down_revision = "b0892bdb8b8e"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("user", sa.Column("sub", sa.String(length=128), nullable=True))
    op.create_index("ik_sub", "user", ["sub"], unique=True)


def downgrade():
    op.drop_index("ik_sub", "user")
    op.drop_column("user", "sub")
