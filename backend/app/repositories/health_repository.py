from sqlalchemy import text
from sqlalchemy.orm import sessionmaker

from app.services.db import db_instance


class HealthRepository:
    def __init__(self, session_factory: sessionmaker | None = None) -> None:
        self._session_factory = session_factory or db_instance.session_local

    def check_db(self) -> bool:
        session_factory = self._session_factory
        with session_factory() as session:
            result = session.execute(text("SELECT 1")).scalar()
            return bool(result)
