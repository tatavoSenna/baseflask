"""empty message

Revision ID: 95b763ec48ba
Revises: 38f330e70544
Create Date: 2021-03-01 09:47:11.090391

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '95b763ec48ba'
down_revision = '38f330e70544'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('company', 'logo_url')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('company', sa.Column('logo_url', sa.VARCHAR(length=1500), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
