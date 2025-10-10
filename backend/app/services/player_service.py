from app.repositories.player_repository import PlayerRepository
import app.models as models

class PlayerService:
    def __init__(self, repo: PlayerRepository):
        self.repo = repo

    def register_player(self, tournament_id: str, data: models.create.Player):
        player = self.repo.register_to_tournament(tournament_id, data)
        return models.read.Player.model_validate(player)

    def remove_player(self, tournament_id: str, player_id: str):
        player = self.repo.remove_from_tournament(tournament_id, player_id)
        return {"message": f"Player {player.name} successfully removed from tournament"}
