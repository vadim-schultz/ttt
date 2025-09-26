from typing import List

from litestar import get, post
from litestar.di import Provide
from litestar.status_codes import HTTP_200_OK, HTTP_201_CREATED
from sqlalchemy.orm import Session

import app.models as models
import app.schemas.orm as orm
from app.services.db import get_db_session
from app.services.utils import initialize_tournament_rounds, reset_tournament_rounds


@get("/", dependencies={"db": Provide(get_db_session)})
async def tournaments(db: Session) -> List[models.read.Tournament]:
    result = db.query(orm.Tournament).all()
    return [models.read.Tournament.model_validate(tournament) for tournament in result]


@get("/tournament/{tournament_id:str}", dependencies={"db": Provide(get_db_session)})
async def tournament(db: Session, tournament_id: str) -> models.read.Tournament:
    """Fetches a single tournament and renders its details."""
    result = db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
    return models.read.Tournament.model_validate(result)


@post("/tournaments", dependencies={"db": Provide(get_db_session)}, status_code=HTTP_201_CREATED)
async def create_tournament(db: Session, data: models.create.Tournament) -> models.read.Tournament:
    """Create a new tournament."""
    tournament = orm.Tournament(
        name=data.name, start_date=data.start_date, status=data.status, rounds_count=data.rounds_count
    )
    db.add(tournament)
    db.commit()
    db.refresh(tournament)
    return models.read.Tournament.model_validate(tournament)


@post(
    "/tournament/{tournament_id:str}/register",
    dependencies={"db": Provide(get_db_session)},
    status_code=HTTP_201_CREATED,
)
async def register_player(db: Session, tournament_id: str, data: models.create.Player) -> models.read.Player:
    """Register a player for a tournament."""
    # Check if tournament exists
    tournament = db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
    if not tournament:
        raise Exception("Tournament not found")

    # Check if player with this email already exists
    existing_player = db.query(orm.Player).filter(orm.Player.email == data.email).first()
    if existing_player:
        # Check if already registered for this tournament
        if existing_player in tournament.registered_players:
            raise Exception("Player already registered for this tournament")
        # Add existing player to tournament
        tournament.registered_players.append(existing_player)
    else:
        # Create new player
        player = orm.Player(name=data.name, email=data.email)
        db.add(player)
        db.commit()
        db.refresh(player)
        # Add new player to tournament
        tournament.registered_players.append(player)
        existing_player = player

    db.commit()
    return models.read.Player.model_validate(existing_player)


@post(
    "/tournament/{tournament_id:str}/remove-player/{player_id:str}",
    dependencies={"db": Provide(get_db_session)},
    status_code=HTTP_200_OK,
)
async def remove_player_from_tournament(db: Session, tournament_id: str, player_id: str) -> dict:
    """Remove a registered player from a tournament."""
    # Check if tournament exists
    tournament = db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
    if not tournament:
        raise Exception("Tournament not found")

    # Check if player exists
    player = db.query(orm.Player).filter(orm.Player.id == player_id).first()
    if not player:
        raise Exception("Player not found")

    # Check if player is registered for this tournament
    if player not in tournament.registered_players:
        raise Exception("Player is not registered for this tournament")

    # Check if tournament has already been initialized (has rounds)
    if tournament.rounds:
        raise Exception("Cannot remove player from an initialized tournament. Reset the tournament first.")

    # Remove player from tournament
    tournament.registered_players.remove(player)
    db.commit()

    return {"message": f"Player {player.name} successfully removed from tournament {tournament.name}"}


@post(
    "/tournament/{tournament_id:str}/initialize", dependencies={"db": Provide(get_db_session)}, status_code=HTTP_200_OK
)
async def initialize_tournament(db: Session, tournament_id: str) -> models.read.Tournament:
    """Initialize a tournament with rounds and matches using registered players."""
    try:
        tournament = initialize_tournament_rounds(db, tournament_id)
        return models.read.Tournament.model_validate(tournament)
    except ValueError as e:
        raise Exception(str(e))


@post("/tournament/{tournament_id:str}/reset", dependencies={"db": Provide(get_db_session)}, status_code=HTTP_200_OK)
async def reset_tournament(db: Session, tournament_id: str) -> models.read.Tournament:
    """Reset a tournament by removing all rounds, matches, and teams while preserving tournament and registered players."""
    try:
        tournament = reset_tournament_rounds(db, tournament_id)
        return models.read.Tournament.model_validate(tournament)
    except ValueError as e:
        raise Exception(str(e))


@post("/tournament/{tournament_id:str}/delete", dependencies={"db": Provide(get_db_session)}, status_code=HTTP_200_OK)
async def delete_tournament(db: Session, tournament_id: str) -> dict:
    """Delete a tournament and all its associated data (players, rounds, matches, teams)."""
    # Get the tournament
    tournament = db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
    if not tournament:
        raise Exception("Tournament not found")

    # Store tournament name for response message
    tournament_name = tournament.name

    # Delete the tournament (CASCADE will handle associated data)
    db.delete(tournament)
    db.commit()

    return {"message": f"Tournament '{tournament_name}' and all its data successfully deleted"}
