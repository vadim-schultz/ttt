from app.repositories.tournament_repository import TournamentRepository
import app.models as models

class TournamentService:
    def __init__(self, repo: TournamentRepository):
        self.repo = repo

    def list_tournaments(self):
        tournaments = self.repo.get_all()
        return [models.read.Tournament.model_validate(t) for t in tournaments]

    def get_tournament(self, tournament_id: str):
        tournament = self.repo.get_by_id(tournament_id)
        return models.read.Tournament.model_validate(tournament)

    def create_tournament(self, data: models.create.Tournament):
        tournament = self.repo.create(data)
        return models.read.Tournament.model_validate(tournament)

    def delete_tournament(self, tournament_id: str):
        tournament = self.repo.delete(tournament_id)
        if not tournament:
            raise Exception("Tournament not found")
        return {"message": f"Tournament '{tournament.name}' and all its data successfully deleted"}

    def reset_tournament(self, tournament_id: str):
        tournament = self.repo.reset(tournament_id)
        return models.read.Tournament.model_validate(tournament)

    def initialize_tournament(self, tournament_id: str):
        tournament = self.repo.initialize(tournament_id)
        return models.read.Tournament.model_validate(tournament)
