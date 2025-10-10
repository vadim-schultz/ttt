"""Add email to player and tournament registration

Revision ID: d123456789ab
Revises: c8ea82c07f5f
Create Date: 2025-09-17 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd123456789ab'
down_revision: Union[str, Sequence[str], None] = 'c8ea82c07f5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add email column to players table
    op.add_column('players', sa.Column('email', sa.String(), nullable=False, server_default=''))
    
    # Create tournament_players association table
    op.create_table('tournament_players',
        sa.Column('tournament_id', sa.String(), nullable=False),
        sa.Column('player_id', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['player_id'], ['players.id'], ),
        sa.ForeignKeyConstraint(['tournament_id'], ['tournaments.id'], ),
        sa.PrimaryKeyConstraint('tournament_id', 'player_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop tournament_players table
    op.drop_table('tournament_players')
    
    # Drop email column from players
    op.drop_column('players', 'email')