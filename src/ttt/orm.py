import uuid

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Match(Base):
    __tablename__ = "matches"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    player0 = Column(String)
    player1 = Column(String)
    player2 = Column(String)
    player3 = Column(String)
    score0 = Column(Integer, default=0)
    score1 = Column(Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "player0": self.player0,
            "player1": self.player1,
            "player2": self.player2,
            "player3": self.player3,
            "score0": self.score0,
            "score1": self.score1,
        }


class Stats(Base):
    __tablename__ = "stats"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    path = Column(String)
    count = Column(Integer, default=0)
