"""add_is_company_admin_collumn_to_user_table

Revision ID: 192f329113f9
Revises: 1ed5c2fb700a
Create Date: 2022-07-08 09:56:22.340065

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "192f329113f9"
down_revision = "1ed5c2fb700a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "user",
        sa.Column(
            "is_company_admin", sa.Boolean(), server_default="true", nullable=False
        ),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("user", "is_company_admin")
    # ### end Alembic commands ###
