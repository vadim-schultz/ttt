from sqlalchemy.orm import Session
import app.schemas.orm as orm

class ScoreRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_match(self, match_id: str):
        return self.db.query(orm.Match).filter(orm.Match.id == match_id).first()

    def get_teams_in_match(self, team_ids: list, match_id: str):
        return (
            self.db.query(orm.Team)
            .filter(orm.Team.id.in_(team_ids), orm.Team.match_id == match_id)
            .all()
        )

    def commit(self):
        self.db.commit()

    def rollback(self):
        self.db.rollback()
