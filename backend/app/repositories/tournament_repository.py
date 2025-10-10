from sqlalchemy.orm import Session
import app.schemas.orm as orm

class TournamentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(orm.Tournament).all()

    def get_by_id(self, tournament_id: str):
        return self.db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()

    def create(self, data):
        tournament = orm.Tournament(
            name=data.name,
            start_date=data.start_date,
            status=data.status,
            rounds_count=data.rounds_count,
        )
        self.db.add(tournament)
        self.db.commit()
        self.db.refresh(tournament)
        return tournament

    def delete(self, tournament_id: str):
        tournament = self.get_by_id(tournament_id)
        if tournament:
            self.db.delete(tournament)
            self.db.commit()
        return tournament

    def reset(self, tournament_id: str):
        # This should call your reset_tournament_rounds utility
        from app.services.utils import reset_tournament_rounds
        return reset_tournament_rounds(self.db, tournament_id)

    def initialize(self, tournament_id: str):
        from app.services.utils import initialize_tournament_rounds
        return initialize_tournament_rounds(self.db, tournament_id)
