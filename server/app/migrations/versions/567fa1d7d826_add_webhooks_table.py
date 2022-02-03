"""Add webhooks table

Revision ID: 567fa1d7d826
Revises: 473382a30175
Create Date: 2021-06-29 11:34:25.845683

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "567fa1d7d826"
down_revision = "473382a30175"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "webhook",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=True),
        sa.Column("webhook", sa.String(length=1500), nullable=True),
        sa.ForeignKeyConstraint(
            ["company_id"],
            ["company.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("webhook"),
    )


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("webhook")
    # ### end Alembic commands ###
