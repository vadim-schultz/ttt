from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


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


# Create a SQLite database in memory for demonstration purposes

engine = create_engine("sqlite:///ttt.db")

Session = sessionmaker(bind=engine)
session = Session()

players = ["Fan Zhendong", "Ma Long", "Xu Xin", "Tomokazu Harimoto", "Dummy1", "Dummy2", "Dummy3", "Dummy4"]
result = session.query(Match).all()
print(result)

standings = []
for player in players:
    score = 0
    left_side_instances = [result for result in result if result.player0 == player or result.player1 == player]
    right_side_instances = [result for result in result if result.player2 == player or result.player3 == player]

    # Add scores to each side
    for matches in left_side_instances:
        score += matches.score0

    for matches in right_side_instances:
        score += matches.score1

    standings.append({"name": player, "points": score})

    e = 1

# Sort list by points
standings.sort(key=lambda x: x["points"], reverse=True)

e = 1
