"""empty message

Revision ID: 059a4e146fbc
Revises: 0583330bfa51
Create Date: 2020-10-20 16:49:22.657788

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '059a4e146fbc'
down_revision = '0583330bfa51'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('document', 'created_at',
                    existing_type=postgresql.TIMESTAMP(timezone=True),
                    type_=sa.DateTime(timezone=True),
                    existing_nullable=False)
    op.alter_column('document_template', 'created_at',
                    existing_type=postgresql.TIMESTAMP(timezone=True),
                    type_=sa.DateTime(timezone=True),
                    existing_nullable=False)


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('document', 'created_at',
                    existing_type=sa.DateTime(),
                    type_=postgresql.TIMESTAMP(),
                    existing_nullable=False)
    op.alter_column('document_template', 'created_at',
                    existing_type=postgresql.TIMESTAMP(),
                    type_=sa.DateTime(),
                    existing_nullable=False)
    # ### end Alembic commands ###