"""empty message

Revision ID: ce2096732916
Revises: 567fa1d7d826
Create Date: 2021-07-03 14:06:41.494726

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ce2096732916'
down_revision = '567fa1d7d826'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('document', sa.Column('data_assinatura', sa.Date(), nullable=True))
    op.add_column('document', sa.Column('data_final_contrato', sa.Date(), nullable=True))
    op.add_column('document', sa.Column('data_inicio_contrato', sa.Date(), nullable=True))
    op.add_column('document', sa.Column('nome_contrato', sa.String(length=255), nullable=True))
    op.add_column('document', sa.Column('valor_contrato', sa.String(length=255), nullable=True))  
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('document', 'valor_contrato')
    op.drop_column('document', 'nome_contrato')
    op.drop_column('document', 'data_inicio_contrato')
    op.drop_column('document', 'data_final_contrato')
    op.drop_column('document', 'data_assinatura')
    # ### end Alembic commands ###