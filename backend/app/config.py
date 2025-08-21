from litestar import Litestar

from app.routes import leaderboard, tournament, tournaments, update_score
from app.services.db import get_db_session
from app.services.utils import populate_tournaments


def on_startup():
    try:
        with next(get_db_session()) as db:
            populate_tournaments(db)
    finally:
        db.close()


app = Litestar(
    on_startup=[on_startup],
    route_handlers=[
        tournaments,
        tournament,
        leaderboard,
        update_score,
    ],
    debug=True,
)
