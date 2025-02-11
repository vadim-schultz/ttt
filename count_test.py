from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database_config import Stats

# Create a SQLite database in memory for demonstration purposes
engine = create_engine("sqlite:///ttt.db")

Session = sessionmaker(bind=engine)


with Session() as session:
    res = session.query(Stats).all()

paths = ["index", "current_standings", "schedule", "result", "enter_result", "rules"]

print([(paths[idx], r.count) for idx, r in enumerate(res)])
