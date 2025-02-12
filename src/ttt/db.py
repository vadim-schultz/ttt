from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from ttt.orm import Base, Match, Stats
from ttt.utils import schedule_from_players
from env import players


def get_default_schedule():
    return schedule_from_players(players)


def get_default_stats():
    paths = ["index", "current_standings", "schedule", "result", "enter_result", "rules"]
    return [Stats(path=i) for i in paths]


def init_db(db_url="sqlite:///ttt.db"):
    # Create an engine that stores data in the local directory's ttt.db file.
    engine = create_engine(db_url)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Create tables if they do not exist
    try:
        Base.metadata.create_all(engine)
    except OperationalError:
        pass

    # Check if tables are empty and populate with default values if needed
    inspector = inspect(engine)

    if 'matches' in inspector.get_table_names():
        if session.query(Match).count() == 0:
            for round in get_default_schedule():
                for match in round:
                    session.add(
                        Match(
                            player0=match[0],
                            player1=match[1],
                            player2=match[2],
                            player3=match[3],
                        )
                    )
            session.commit()

    if 'stats' in inspector.get_table_names():
        if session.query(Stats).count() == 0:
            session.add_all(get_default_stats())
            session.commit()

    session.close()


def tick(Session, path):
    with Session() as session:
        result = session.query(Stats).filter(Stats.path == path)
        count = result[0].count + 1
        result.update({"count": count})
        session.commit()


if __name__ == "__main__":
    init_db()

