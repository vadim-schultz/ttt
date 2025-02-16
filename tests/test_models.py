import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# from ttt.schemas.orm import Base, Tournament, Round, Game, Team, Player
# from ttt.models.read import TournamentRead, RoundRead
# from ttt.models.write import TournamentCreate, RoundCreate, GameCreate, TeamCreate, PlayerCreate, TeamScoreUpdate
import ttt.schemas.orm as orm
import ttt.models as models


@pytest.fixture
def player_names():
    return [
        "Alice", "Bob", "Charlie", "Dana", "Eve", "Frank", "Grace", "Hank",
        "Ivy", "Jack", "Kara", "Leo", "Mona", "Nate", "Olivia", "Pete",
        "Quinn", "Rachel", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xander"
    ]


@pytest.fixture(scope="session")
def engine():
    return create_engine("sqlite:///:memory:", echo=True)


@pytest.fixture(scope="session")
def tables(engine):
    orm.Base.metadata.create_all(engine)
    yield
    orm.Base.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def db_session(engine, tables):
    """Returns an sqlalchemy session, and after the test tears down everything properly."""
    connection = engine.connect()
    transaction = connection.begin()

    # Bind an individual Session to the connection
    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

# Helper method to create a complete tournament with nested rounds, matches, teams, and players
def create_complete_tournament(db_session):
    # Create tournament using TournamentCreate schema
    tournament_data = models.create.Tournament(
        start_date="2025-02-15",
        rounds_count=5
    )

    tournament_model = orm.Tournament(**tournament_data.model_dump())  # Convert to ORM model

    db_session.add(tournament_model)
    db_session.commit()

    # Create rounds, matches, teams, and players
    for round_number in range(1, tournament_data.rounds_count + 1):
        round_data = models.create.Round(round_number=round_number, tournament_id=tournament_model.id)
        round_model = orm.Round(**round_data.model_dump())  # Convert to ORM model

        db_session.add(round_model)
        db_session.commit()

        # Create matches for each round
        for match_number in range(1, 3):  # Creating 2 matches for each round (example)
            match_data = models.create.Match(round_id=round_model.id)
            match_model = orm.Match(**match_data.model_dump())

            db_session.add(match_model)
            db_session.commit()

            # Create teams for each match
            team1_data = models.create.Team(match_id=match_model.id)
            team1_model = orm.Team(**team1_data.model_dump())

            team2_data = models.create.Team(match_id=match_model.id)
            team2_model = orm.Team(**team2_data.model_dump())

            db_session.add(team1_model)
            db_session.add(team2_model)
            db_session.commit()

            # Create players for each team
            player1_data = models.create.Player(name="Player 1")
            player1_model = orm.Player(**player1_data.model_dump())
            player1_model.teams.append(team1_model)

            player2_data = models.create.Player(name="Player 2")
            player2_model = orm.Player(**player2_data.model_dump())
            player2_model.teams.append(team2_model)

            db_session.add(player1_model)
            db_session.add(player2_model)
            db_session.commit()

    return tournament_model  # Return the created tournament


# Test to create a complete tournament and read back the data
def test_create_and_read_tournament(db_session):
    # Create the complete tournament with all nested models
    created_tournament = create_complete_tournament(db_session)

    # Step 1: Query the database and convert to Pydantic models for reading
    tournament_from_db = db_session.query(orm.Tournament).filter(orm.Tournament.id == created_tournament.id).first()

    # Convert the ORM model to the corresponding Pydantic read model
    tournament_read_model = models.read.Tournament.model_validate(tournament_from_db)
    print("Tournament from DB:", tournament_read_model)

    # Step 2: Assert the tournament data is correct
    assert str(tournament_read_model.start_date) == "2025-02-15"
    assert tournament_read_model.rounds_count == 5
    assert tournament_read_model.status == "ongoing"


# Test for reading a round, match, and team with players
def test_read_round_and_nested_models(db_session):
    # Create a complete tournament first
    created_tournament = create_complete_tournament(db_session)

    # Read back the first round
    round_from_db = db_session.query(orm.Round).filter(orm.Round.tournament_id == created_tournament.id).first()
    round_read_model = models.read.Round.model_validate(round_from_db)
    print("Round from DB:", round_read_model)

    # Read back matches for the round
    for match in round_read_model.matches:
        print(f"Match {match.id} with {len(match.teams)} teams:")
        for team in match.teams:
            print(f"  Team {team.id} with score {team.score} and players: {', '.join([player.name for player in team.players])}")

    # Assert the round has matches and teams
    assert len(round_read_model.matches) > 0  # Should have matches
    assert len(round_read_model.matches[0].teams) == 2  # Should have two teams per match


# Test for creating a match and updating team scores
def test_update_match_score(db_session):
    # Create a complete tournament first
    created_tournament = create_complete_tournament(db_session)

    # Get the first match from the first round
    first_round = db_session.query(orm.Round).filter(orm.Round.tournament_id == created_tournament.id).first()
    match = db_session.query(orm.Match).filter(orm.Match.round_id == first_round.id).first()

    # Update the score for the teams in the match
    match_score_data = models.modify.TeamScore(
        match_id=match.id,
        team_scores=[3, 2]  # Team 1's score is 3, Team 2's score is 2
    )

    # Step 1: Get the teams for the match
    teams = match.teams
    teams[0].score = match_score_data.team_scores[0]
    teams[1].score = match_score_data.team_scores[1]
    db_session.commit()

    # Step 2: Read back the updated match and teams
    updated_match = db_session.query(orm.Match).filter(orm.Match.id == match.id).first()

    assert updated_match.teams[0].score == 3
    assert updated_match.teams[1].score == 2