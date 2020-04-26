"""empty message

Revision ID: 8059b551b714
Revises: 637c38bb948c
Create Date: 2020-04-25 22:23:13.585114

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8059b551b714'
down_revision = '637c38bb948c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('document_version',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('version_number', sa.Integer(), nullable=True),
    sa.Column('document_id', sa.Integer(), nullable=False),
    sa.Column('filename', sa.String(length=255), nullable=True),
    sa.Column('answers', postgresql.JSON(astext_type=sa.Text()), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['document_id'], ['document.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('document', sa.Column('title', sa.String(length=255), nullable=False))
    op.drop_column('document', 'questions')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('document', sa.Column('questions', sa.TEXT(), autoincrement=False, nullable=False))
    op.drop_column('document', 'title')
    op.drop_table('document_version')
    # ### end Alembic commands ###
