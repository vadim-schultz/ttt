from typing import List

from litestar import get
from litestar.di import Provide
from sqlalchemy import func
from sqlalchemy.orm import Session

import app.models as models
import app.schemas.orm as orm
from app.services.db import get_db_session


@get("/leaderboard", dependencies={"db": Provide(get_db_session)})
async def leaderboard(db: Session) -> List[models.read.Player]:
    """Fetches all players sorted by highest score first and renders them in a table."""
    # result = db.query(orm.Player).order_by(orm.Player.cumulative_score.desc()).all()
    result = (
        db.query(orm.Player.id, orm.Player.name, func.coalesce(func.sum(orm.Team.score), 0).label("cumulative_score"))
        .join(orm.player_team_association, orm.Player.id == orm.player_team_association.c.player_id)
        .join(orm.Team, orm.player_team_association.c.team_id == orm.Team.id)
        .group_by(orm.Player.id, orm.Player.name)
        .order_by(func.sum(orm.Team.score).desc())
        .all()
    )

    return [models.read.Player.model_validate(player._asdict()) for player in result]


@get("/tournament/{tournament_id:str}/leaderboard", dependencies={"db": Provide(get_db_session)})
async def tournament_leaderboard(db: Session, tournament_id: str) -> List[models.read.Player]:
    """Fetches all players from a specific tournament sorted by highest score first."""
    result = (
        db.query(
            orm.Player.id,
            orm.Player.name,
            orm.Player.email,
            func.coalesce(func.sum(orm.Team.score), 0).label("cumulative_score"),
        )
        .join(orm.player_team_association, orm.Player.id == orm.player_team_association.c.player_id)
        .join(orm.Team, orm.player_team_association.c.team_id == orm.Team.id)
        .join(orm.Match, orm.Team.match_id == orm.Match.id)
        .join(orm.Round, orm.Match.round_id == orm.Round.id)
        .join(orm.Tournament, orm.Round.tournament_id == orm.Tournament.id)
        .filter(orm.Tournament.id == tournament_id)
        .group_by(orm.Player.id, orm.Player.name, orm.Player.email)
        .order_by(func.sum(orm.Team.score).desc())
        .all()
    )

    return [models.read.Player.model_validate(player._asdict()) for player in result]
