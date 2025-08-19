import random
import typing as ty
from datetime import date

import numpy as np
from sqlalchemy.orm import Session

from app.schemas.orm import Match, Player, Round, Team, Tournament


def schedule_from_players(players: ty.List[str]):
    np.random.seed(7)

    matches = []
    for i in range(10):
        # Shuffle players
        np.random.shuffle(players)

        round_x = np.split(np.array(players), 6)

        # Convert back to lists
        round_x = [x.tolist() for x in round_x]
        matches.append(round_x)

    return matches


def standings_from_results(results, players):
    standings = []
    for player in players:
        score = 0
        matches_played = 0
        left_side_instances = [result for result in results if result.player0 == player or result.player1 == player]
        right_side_instances = [result for result in results if result.player2 == player or result.player3 == player]

        # Add scores to each side
        for matches in left_side_instances:
            score += matches.score0
            if matches.score0 != 0 or matches.score1 != 0:
                matches_played += 1

        for matches in right_side_instances:
            score += matches.score1
            if matches.score0 != 0 or matches.score1 != 0:
                matches_played += 1

        standings.append({"name": player, "points": score, "matches_played": matches_played})

    # Sort list by points
    standings.sort(key=lambda x: x["points"], reverse=True)

    # Add rank to dict
    for i, player in enumerate(standings):
        player["rank"] = i + 1

    return standings


first_names = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Elizabeth",
    "David",
    "Barbara",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Sarah",
    "Charles",
    "Karen",
    "Christopher",
    "Nancy",
    "Daniel",
    "Margaret",
]

surnames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
]


def get_player_names(count: int = 24):
    return [f"{random.choice(first_names)} {random.choice(surnames)}" for _ in range(count)]


def populate_full_tournament(db_session: Session, num_players: int = 24, rounds_count: int = 3):
    """Populate the DB with a test tournament only if tables are empty."""

    # Check if tables already have data
    if db_session.query(Tournament).first():
        print("Tournament table is not empty, skipping seeding.")
        return

    print("Seeding database with test tournament data...")
    player_names = get_player_names(num_players)

    # Step 1: Tournament
    tournament = Tournament(start_date=date.today(), rounds_count=rounds_count)
    db_session.add(tournament)
    db_session.commit()

    # Step 2: Players
    players = [Player(name=name, cumulative_score=0) for name in player_names]
    db_session.add_all(players)
    db_session.commit()

    # Step 3: Rounds and matches
    for round_number in range(1, tournament.rounds_count + 1):
        round_obj = Round(round_number=round_number, tournament_id=tournament.id)
        db_session.add(round_obj)
        db_session.commit()

        for _ in range(6):  # 6 matches per round
            match = Match(round_id=round_obj.id)
            db_session.add(match)
            db_session.commit()

            random.shuffle(players)
            team1 = Team(match_id=match.id, score=random.randint(0, 21))
            team2 = Team(match_id=match.id, score=random.randint(0, 21))

            team1.players.extend(players[:2])
            team2.players.extend(players[2:4])

            db_session.add_all([team1, team2])
            db_session.commit()
