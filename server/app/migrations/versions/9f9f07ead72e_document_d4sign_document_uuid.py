"""Document d4sign_document_uuid

Revision ID: 9f9f07ead72e
Revises: f5a3ff33bc0f
Create Date: 2021-09-07 18:24:07.516495

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9f9f07ead72e"
down_revision = "f5a3ff33bc0f"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "document",
        sa.Column("d4sign_document_uuid", sa.String(length=255), nullable=True),
    )
    op.create_unique_constraint(
        "document_unique_d4sign_document_uuid", "document", ["d4sign_document_uuid"]
    )


def downgrade():
    op.drop_constraint(
        "document_unique_d4sign_document_uuid", "document", type_="unique"
    )
    op.drop_column("document", "d4sign_document_uuid")
