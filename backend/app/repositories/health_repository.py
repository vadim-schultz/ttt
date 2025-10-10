import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

class HealthRepository:
    def check_db(self, database_url=None):
        database_url = database_url or os.getenv("DATABASE_URL", "postgresql+psycopg2://user:user@db:5432/ttt")
        engine = create_engine(
            database_url,
            pool_timeout=2,
            pool_recycle=30,
            connect_args={"connect_timeout": 3},
        )
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            result = session.execute(text("SELECT 1")).fetchone()
            return result is not None
        finally:
            session.close()
            engine.dispose()
