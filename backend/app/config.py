from litestar import Litestar

from app.routes import (
    create_tournament,
    delete_tournament,
    health_check,
    initialize_tournament,
    leaderboard,
    readiness_check,
    register_player,
    remove_player_from_tournament,
    reset_tournament,
    tournament,
    tournament_leaderboard,
    tournaments,
    update_score,
)
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
            tournaments,
            tournament,
            create_tournament,
            register_player,
            remove_player_from_tournament,
            initialize_tournament,
            reset_tournament,
            delete_tournament,
        ],
        dependencies=dependencies,
        debug=True,
    )

app = create_app()
app = Litestar(
    on_startup=[on_startup],
    route_handlers=[
        tournaments,
        tournament,
        leaderboard,
        tournament_leaderboard,
        update_score,
        create_tournament,
        register_player,
        remove_player_from_tournament,
        initialize_tournament,
        reset_tournament,
        delete_tournament,
        health_check,
        readiness_check,
    ],
    debug=True,
)
