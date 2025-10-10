from litestar import Controller, get
from litestar.di import Provide
from sqlalchemy.orm import Session
from app.dependencies import provide_db_session
from app.services.leaderboard_service import LeaderboardService
import app.models as models

# Dependency provider

def provide_leaderboard_service(
    db: Session = Provide(provide_db_session),
) -> LeaderboardService:
    from app.repositories.leaderboard_repository import LeaderboardRepository
    return LeaderboardService(LeaderboardRepository(db))

class LeaderboardController(Controller):
    path = "/leaderboard"

    @get("/", dependencies={"service": Provide(provide_leaderboard_service, sync_to_thread=False)})
    async def leaderboard(self, service: LeaderboardService) -> list[models.read.Player]:
        return service.get_leaderboard()

    @get(
        "/tournament/{tournament_id:str}",
        dependencies={"service": Provide(provide_leaderboard_service, sync_to_thread=False)},
    )
    async def tournament_leaderboard(self, service: LeaderboardService, tournament_id: str) -> list[models.read.Player]:
        return service.get_tournament_leaderboard(tournament_id)
