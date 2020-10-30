"""empty message

Revision ID: 37783b788108
Revises: 4ef1e8ce8c7f
Create Date: 2020-09-30 17:10:10.483213

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '37783b788108'
down_revision = 'a2f17bdfcd58'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_group',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(length=255), nullable=True),
                    sa.Column('company_id', sa.Integer(), nullable=True),
                    sa.Column('active', sa.Boolean(), nullable=True),
                    sa.ForeignKeyConstraint(['company_id'], ['company.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.add_column('user', sa.Column(
        'user_group_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'user', 'user_group',
                          ['user_group_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='foreignkey')
    op.drop_column('user', 'user_group_id')
    op.drop_table('user_group')
    # ### end Alembic commands ###