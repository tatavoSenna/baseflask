"""empty message

Revision ID: e538803ddb41
Revises: 3e18fff71652
Create Date: 2020-12-10 12:43:23.493281

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e538803ddb41"
down_revision = "3e18fff71652"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("document", sa.Column("signed", sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("document", "signed")
    # ### end Alembic commands ###
