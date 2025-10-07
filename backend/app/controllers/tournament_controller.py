from litestar import Controller, get, post, status_codes
from litestar.di import Provide
from sqlalchemy.orm import Session
from app.services.db import get_db_session
from app.services.tournament_service import TournamentService
from app.services.player_service import PlayerService
import app.models as models

# Dependency providers

def provide_tournament_service(db: Session = Provide(get_db_session)) -> TournamentService:
    from app.repositories.tournament_repository import TournamentRepository
    return TournamentService(TournamentRepository(db))

def provide_player_service(db: Session = Provide(get_db_session)) -> PlayerService:
    from app.repositories.player_repository import PlayerRepository
    return PlayerService(PlayerRepository(db))

class TournamentController(Controller):
    path = "/tournament"

    # Tournament endpoints
    @get("/", dependencies={"service": Provide(provide_tournament_service)})
    async def list_tournaments(self, service: TournamentService) -> list[models.read.Tournament]:
        return service.list_tournaments()

    @get("/{tournament_id:str}", dependencies={"service": Provide(provide_tournament_service)})
    async def get_tournament(self, service: TournamentService, tournament_id: str) -> models.read.Tournament:
        return service.get_tournament(tournament_id)

    @post("/", dependencies={"service": Provide(provide_tournament_service)}, status_code=status_codes.HTTP_201_CREATED)
    async def create_tournament(self, service: TournamentService, data: models.create.Tournament) -> models.read.Tournament:
        return service.create_tournament(data)

    @post("/{tournament_id:str}/delete", dependencies={"service": Provide(provide_tournament_service)}, status_code=status_codes.HTTP_200_OK)
    async def delete_tournament(self, service: TournamentService, tournament_id: str) -> dict:
        return service.delete_tournament(tournament_id)

    @post("/{tournament_id:str}/reset", dependencies={"service": Provide(provide_tournament_service)}, status_code=status_codes.HTTP_200_OK)
    async def reset_tournament(self, service: TournamentService, tournament_id: str) -> models.read.Tournament:
        return service.reset_tournament(tournament_id)

    @post("/{tournament_id:str}/initialize", dependencies={"service": Provide(provide_tournament_service)}, status_code=status_codes.HTTP_200_OK)
    async def initialize_tournament(self, service: TournamentService, tournament_id: str) -> models.read.Tournament:
        return service.initialize_tournament(tournament_id)

    # Player endpoints
    @post("/{tournament_id:str}/register", dependencies={"player_service": Provide(provide_player_service)}, status_code=status_codes.HTTP_201_CREATED)
    async def register_player(self, player_service: PlayerService, tournament_id: str, data: models.create.Player) -> models.read.Player:
        return player_service.register_player(tournament_id, data)

    @post("/{tournament_id:str}/remove-player/{player_id:str}", dependencies={"player_service": Provide(provide_player_service)}, status_code=status_codes.HTTP_200_OK)
    async def remove_player(self, player_service: PlayerService, tournament_id: str, player_id: str) -> dict:
        return player_service.remove_player(tournament_id, player_id)
