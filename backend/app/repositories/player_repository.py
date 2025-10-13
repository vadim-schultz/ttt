from sqlalchemy.orm import Session
import app.schemas.orm as orm

class PlayerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, player_id: str):
        return self.db.query(orm.Player).filter(orm.Player.id == player_id).first()

    def get_by_email(self, email: str):
        return self.db.query(orm.Player).filter(orm.Player.email == email).first()

    def register_to_tournament(self, tournament_id: str, player_data):
        tournament = self.db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
        if not tournament:
            raise Exception("Tournament not found")

        try:
            player = self.get_by_email(player_data.email)
            if player:
                if player in tournament.registered_players:
                    raise Exception("Player already registered for this tournament")
            else:
                player = orm.Player(name=player_data.name, email=player_data.email)
                self.db.add(player)

            tournament.registered_players.append(player)
            self.db.commit()
            self.db.refresh(player)
            return player
        except Exception:
            self.db.rollback()
            raise

    def remove_from_tournament(self, tournament_id: str, player_id: str):
        tournament = self.db.query(orm.Tournament).filter(orm.Tournament.id == tournament_id).first()
        if not tournament:
            raise Exception("Tournament not found")
        player = self.get_by_id(player_id)
        if not player:
            raise Exception("Player not found")
        if player not in tournament.registered_players:
            raise Exception("Player is not registered for this tournament")
        if tournament.rounds:
            raise Exception("Cannot remove player from an initialized tournament. Reset the tournament first.")
        tournament.registered_players.remove(player)
        self.db.commit()
        return player
