"""empty message

Revision ID: 0e554cb3519a
Revises: 8852549d09c8
Create Date: 2021-02-02 11:55:19.581668

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from datetime import datetime

# revision identifiers, used by Alembic.
revision = "0e554cb3519a"
down_revision = "8852549d09c8"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "document_template", sa.Column("created_at", sa.DateTime(), nullable=True)
    )
    op.execute(f"UPDATE document_template SET created_at = '{datetime.utcnow()}'")
    op.alter_column("document_template", "created_at", nullable=False)
    op.add_column(
        "document_template", sa.Column("user_id", sa.Integer(), nullable=True)
    )
    op.create_foreign_key(None, "document_template", "user", ["user_id"], ["id"])
    op.drop_column("document_template", "filetype")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "document_template",
        sa.Column(
            "filetype",
            postgresql.ENUM("docx", "pdf", name="template_file_type"),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.drop_constraint(None, "document_template", type_="foreignkey")
    op.drop_column("document_template", "user_id")
    op.drop_column("document_template", "created_at")
    # ### end Alembic commands ###
