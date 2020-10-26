"""empty message

Revision ID: 25335642fb41
Revises: 39715b7ba409
Create Date: 2020-10-20 16:49:22.657788

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '25335642fb41'
down_revision = '39715b7ba409'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('document_version')
    op.add_column('document', sa.Column('versions', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('document', 'versions')
    op.create_table('document_version',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('version_number', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('document_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('filename', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('answers', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['document_id'], ['document.id'], name='document_version_document_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='document_version_pkey')
    )
    # ### end Alembic commands ###
