from app.repositories.leaderboard_repository import LeaderboardRepository
import app.models as models

class LeaderboardService:
    def __init__(self, repo: LeaderboardRepository):
        self.repo = repo

    def get_leaderboard(self):
        result = self.repo.get_leaderboard()
        return [models.read.Player.model_validate(player._asdict()) for player in result]

    def get_tournament_leaderboard(self, tournament_id: str):
        result = self.repo.get_tournament_leaderboard(tournament_id)
        return [models.read.Player.model_validate(player._asdict()) for player in result]
