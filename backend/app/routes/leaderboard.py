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
