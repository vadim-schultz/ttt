from litestar import Controller, get

from app.services.leaderboard_service import LeaderboardService
import app.models as models

class LeaderboardController(Controller):
    path = "/leaderboard"

    @get("/")
    async def leaderboard(self, leaderboard_service: LeaderboardService) -> list[models.read.Player]:
        return leaderboard_service.get_leaderboard()

    @get(
        "/tournament/{tournament_id:str}",
    )
    async def tournament_leaderboard(
        self, leaderboard_service: LeaderboardService, tournament_id: str
    ) -> list[models.read.Player]:
        return leaderboard_service.get_tournament_leaderboard(tournament_id)
