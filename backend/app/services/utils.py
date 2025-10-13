import logging
import numpy as np
from sqlalchemy.orm import Session

from app.schemas.orm import Match, Round, Team, Tournament


logger = logging.getLogger(__name__)


def initialize_tournament_rounds(db_session: Session, tournament_id: str):
    """Initialize a tournament with rounds and matches using registered players."""

    # Get the tournament
    tournament = db_session.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise ValueError(f"Tournament with id {tournament_id} not found")

    # Check if tournament is already initialized
    if tournament.rounds:
        raise ValueError("Tournament already has rounds initialized")

    # Get registered players
    players = tournament.registered_players
    if len(players) < 4:
        raise ValueError("Need at least 4 players to initialize tournament")

    # Calculate matches per round based on number of players
    # Each match needs 4 players (2v2), so matches_per_round = players // 4
    matches_per_round = max(1, len(players) // 4)

    logger.info(
        "Initializing tournament '%s' with %s players (%s rounds, %s matches each)",
        tournament.name,
        len(players),
        tournament.rounds_count,
        matches_per_round,
    )

    with db_session.begin():
        for round_number in range(1, tournament.rounds_count + 1):
            round_obj = Round(round_number=round_number, tournament_id=tournament.id)
            db_session.add(round_obj)

            round_players = players.copy()
            np.random.shuffle(round_players)

            for match_idx in range(matches_per_round):
                match = Match(round_id=round_obj.id)
                db_session.add(match)

                team1 = Team(match_id=match.id, score=0)
                team2 = Team(match_id=match.id, score=0)

                start_idx = match_idx * 4
                if start_idx + 3 < len(round_players):
                    team1.players.extend(round_players[start_idx : start_idx + 2])
                    team2.players.extend(round_players[start_idx + 2 : start_idx + 4])
                else:
                    available_players = (
                        round_players[start_idx:]
                        + round_players[: max(0, 4 - (len(round_players) - start_idx))]
                    )
                    if len(available_players) >= 4:
                        team1.players.extend(available_players[:2])
                        team2.players.extend(available_players[2:4])
                    else:
                        team1.players.extend(round_players[:2])
                        team2.players.extend(
                            round_players[2:4] if len(round_players) >= 4 else round_players[:2]
                        )

                db_session.add_all([team1, team2])

    logger.info("Tournament '%s' initialized successfully", tournament.name)
    return tournament


def reset_tournament_rounds(db_session: Session, tournament_id: str):
    """Reset a tournament by removing all rounds, matches, and teams while preserving the tournament and registered players."""

    # Get the tournament
    tournament = db_session.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not tournament:
        raise ValueError(f"Tournament with id {tournament_id} not found")

    # Check if tournament has anything to reset
    if not tournament.rounds:
        raise ValueError("Tournament has no rounds to reset")

    logger.info("Resetting tournament '%s'", tournament.name)

    rounds_deleted = 0
    matches_deleted = 0
    teams_deleted = 0

    for round_obj in tournament.rounds:
        for match in round_obj.matches:
            teams_deleted += len(match.teams)
            matches_deleted += 1
        rounds_deleted += 1

    with db_session.begin():
        tournament.rounds.clear()
        tournament.status = "pending"

    logger.info(
        "Tournament '%s' reset successfully. Removed %s rounds, %s matches, %s teams; preserved %s players",
        tournament.name,
        rounds_deleted,
        matches_deleted,
        teams_deleted,
        len(tournament.registered_players),
    )

    return tournament
