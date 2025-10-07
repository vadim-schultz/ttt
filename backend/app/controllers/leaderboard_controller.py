from litestar import Controller, get
from litestar.di import Provide
from sqlalchemy.orm import Session
from app.services.db import get_db_session
from app.services.leaderboard_service import LeaderboardService
import app.models as models

# Dependency provider

def provide_leaderboard_service(db: Session = Provide(get_db_session)) -> LeaderboardService:
    from app.repositories.leaderboard_repository import LeaderboardRepository
    return LeaderboardService(LeaderboardRepository(db))

class LeaderboardController(Controller):
    path = "/leaderboard"

    @get("/", dependencies={"service": Provide(provide_leaderboard_service)})
    async def leaderboard(self, service: LeaderboardService) -> list[models.read.Player]:
        return service.get_leaderboard()

    @get("/tournament/{tournament_id:str}", dependencies={"service": Provide(provide_leaderboard_service)})
    async def tournament_leaderboard(self, service: LeaderboardService, tournament_id: str) -> list[models.read.Player]:
        return service.get_tournament_leaderboard(tournament_id)
