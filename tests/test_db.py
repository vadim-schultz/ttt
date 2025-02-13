import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ttt.orm import Base, Match, Stats


@pytest.fixture(scope="session")
def engine():
    return create_engine("sqlite:///:memory:", echo=True)


@pytest.fixture(scope="session")
def tables(engine):
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)


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


def test_create_match(db_session):
    # Create a new match
    new_match = Match(player0="Alice", player1="Bob", player2="Charlie", player3="Dave", score0=10, score1=15)
    db_session.add(new_match)
    db_session.commit()

    # Query the match
    match = db_session.query(Match).filter_by(player0="Alice").first()
    assert match is not None
    assert match.player1 == "Bob"
    assert match.score0 == 10
    assert match.score1 == 15


def test_create_stats(db_session):
    # Create a new stats entry
    new_stats = Stats(path="/path/to/resource", count=5)
    db_session.add(new_stats)
    db_session.commit()

    # Query the stats entry
    stats = db_session.query(Stats).filter_by(path="/path/to/resource").first()
    assert stats is not None
    assert stats.count == 5


def test_update_match_score(db_session):
    # Create a new match
    new_match = Match(player0="Alice", player1="Bob", player2="Charlie", player3="Dave", score0=10, score1=15)
    db_session.add(new_match)
    db_session.commit()

    # Update the match score
    match = db_session.query(Match).filter_by(player0="Alice").first()
    match.score0 = 20
    db_session.commit()

    # Query the updated match
    updated_match = db_session.query(Match).filter_by(player0="Alice").first()
    assert updated_match.score0 == 20


def test_increment_stats_count(db_session):
    # Create a new stats entry
    new_stats = Stats(path="/path/to/resource", count=5)
    db_session.add(new_stats)
    db_session.commit()

    # Increment the stats count
    stats = db_session.query(Stats).filter_by(path="/path/to/resource").first()
    stats.count += 1
    db_session.commit()

    # Query the updated stats entry
    updated_stats = db_session.query(Stats).filter_by(path="/path/to/resource").first()
    assert updated_stats.count == 6
