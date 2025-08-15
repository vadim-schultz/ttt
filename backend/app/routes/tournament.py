from typing import List

from litestar import get
from litestar.di import Provide
from sqlalchemy.orm import Session

import app.models as models
import app.schemas.orm as orm
from app.services.db import get_db_session


@get("/", dependencies={"db": Provide(get_db_session)})
async def tournaments(db: Session) -> List[models.read.Tournament]:
    result = db.query(orm.Tournament).all()
    return [models.read.Tournament.model_validate(tournament) for tournament in result]


@get("/tournament/{tournament_id:str}", dependencies={"db": Provide(get_db_session)})
async def tournament(db: Session, tournament_id: str) -> models.read.Tournament:
    """Fetches a single tournament and renders its details."""
    result = db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
    return models.read.Tournament.model_validate(result)
