from litestar import Litestar

from app.schemas.orm import Base
from app.services.db import db_instance
from app.controllers.tournament_controller import TournamentController
from app.controllers.score_controller import ScoreController
from app.controllers.leaderboard_controller import LeaderboardController
from app.controllers.health_controller import HealthController
from app.dependencies import dependencies


def on_startup():
    """Create database tables on startup."""
    Base.metadata.create_all(bind=db_instance.engine)


def create_app() -> Litestar:
    """Create and configure the Litestar application."""
    return Litestar(
        on_startup=[on_startup],
        route_handlers=[
            TournamentController,
            ScoreController,
            LeaderboardController,
            HealthController,
        ],
        dependencies=dependencies,
        debug=True,
    )

app = create_app()
