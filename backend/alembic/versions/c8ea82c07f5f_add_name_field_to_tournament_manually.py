"""Add name field to Tournament manually

Revision ID: c8ea82c07f5f
Revises: b56b1be6b52a
Create Date: 2025-09-16 07:33:45.714069

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8ea82c07f5f'
down_revision: Union[str, Sequence[str], None] = 'c71322ff11fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add name column to tournaments table
    op.add_column('tournaments', sa.Column('name', sa.String(), nullable=True))
    
    # Update existing tournaments with default names using a subquery
    op.execute("""
        UPDATE tournaments 
        SET name = 'Tournament ' || t.rn::text
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY start_date) as rn
            FROM tournaments
        ) t
        WHERE tournaments.id = t.id AND tournaments.name IS NULL
    """)
    
    # Make the column non-nullable after populating it
    op.alter_column('tournaments', 'name', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the name column
    op.drop_column('tournaments', 'name')
