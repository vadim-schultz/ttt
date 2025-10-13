from litestar import Controller, get, post, status_codes

from app.services.player_service import PlayerService
from app.services.tournament_service import TournamentService
import app.models as models

class TournamentController(Controller):
    path = "/tournament"

    # Tournament endpoints
    @get("/")
    async def list_tournaments(self, tournament_service: TournamentService) -> list[models.read.Tournament]:
        return tournament_service.list_tournaments()

    @get("/{tournament_id:str}")
    async def get_tournament(
        self, tournament_service: TournamentService, tournament_id: str
    ) -> models.read.Tournament:
        return tournament_service.get_tournament(tournament_id)

    @post(
        "/",
        status_code=status_codes.HTTP_201_CREATED,
    )
    async def create_tournament(
        self, tournament_service: TournamentService, data: models.create.Tournament
    ) -> models.read.Tournament:
        return tournament_service.create_tournament(data)

    @post(
        "/{tournament_id:str}/delete",
        status_code=status_codes.HTTP_200_OK,
    )
    async def delete_tournament(self, tournament_service: TournamentService, tournament_id: str) -> dict:
        return tournament_service.delete_tournament(tournament_id)

    @post(
        "/{tournament_id:str}/reset",
        status_code=status_codes.HTTP_200_OK,
    )
    async def reset_tournament(
        self, tournament_service: TournamentService, tournament_id: str
    ) -> models.read.Tournament:
        return tournament_service.reset_tournament(tournament_id)

    @post(
        "/{tournament_id:str}/initialize",
        status_code=status_codes.HTTP_200_OK,
    )
    async def initialize_tournament(
        self, tournament_service: TournamentService, tournament_id: str
    ) -> models.read.Tournament:
        return tournament_service.initialize_tournament(tournament_id)

    # Player endpoints
    @post(
        "/{tournament_id:str}/register",
        status_code=status_codes.HTTP_201_CREATED,
    )
    async def register_player(
        self, player_service: PlayerService, tournament_id: str, data: models.create.Player
    ) -> models.read.Player:
        return player_service.register_player(tournament_id, data)

    @post(
        "/{tournament_id:str}/remove-player/{player_id:str}",
        status_code=status_codes.HTTP_200_OK,
    )
    async def remove_player(self, player_service: PlayerService, tournament_id: str, player_id: str) -> dict:
        return player_service.remove_player(tournament_id, player_id)
