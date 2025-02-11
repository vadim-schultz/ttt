import typing as ty

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


class StatsSchema(BaseModel):
    uuid: int
    path: str
    count: int

    class Config:
        from_attributes = True


class MatchSchema(BaseModel):
    id: int
    player0: str
    player1: str
    player2: str
    player3: str
    score0: int
    score1: int

    class Config:
        from_attributes = True


Base = declarative_base()


class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True)
    player0 = Column(String)
    player1 = Column(String)
    player2 = Column(String)
    player3 = Column(String)
    score0 = Column(Integer)
    score1 = Column(Integer)


class Stats(Base):
    __tablename__ = "stats"
    uuid = Column(Integer, primary_key=True, autoincrement=True)
    path = Column(String)
    count = Column(Integer)


def init_db_with_empty_results(schedule: ty.List[ty.List[str]]):
    engine = create_engine("sqlite:///ttt.db")
    Match.__table__.drop(engine)
    # Stats.__table__.drop(engine)
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)()

    id_counter = 1
    for round in schedule:
        for match in round:
            session.add(
                Match(
                    id=id_counter,
                    player0=match[0],
                    player1=match[1],
                    player2=match[2],
                    player3=match[3],
                    score0=0,
                    score1=0,
                )
            )
            id_counter += 1

    session.commit()

    # paths = ["index", "current_standings", "schedule", "result", "enter_result", "rules"]

    # for id, path in enumerate(paths):
    #     session.add(Stats(uuid=id, path=path, count=0))

    # session.commit()


def tick(Session, path):
    with Session() as session:
        result = session.query(Stats).filter(Stats.path == path)

        count = result[0].count + 1

        result.update({"count": count})

        session.commit()


# Create a SQLite database in memory for demonstration purposes

# engine = create_engine("sqlite:///:memory:")

if __name__ == "__main__":
    # Create DB
    engine = create_engine("sqlite:///ttt.db")
    Base.metadata.create_all(engine)
