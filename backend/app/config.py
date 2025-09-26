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


def on_startup():
    """Create database tables on startup."""
    Base.metadata.create_all(bind=db_instance.engine)


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
