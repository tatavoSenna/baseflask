"""empty message

Revision ID: 436d341d1d5c
Revises: 059a4e146fbc
Create Date: 2021-05-21 18:30:52.092174

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "436d341d1d5c"
down_revision = "059a4e146fbc"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "document_template", sa.Column("published", sa.Boolean(), nullable=True)
    )
    op.execute(f"UPDATE document_template SET published = {False}")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("document_template", "published")
    # ### end Alembic commands ###
