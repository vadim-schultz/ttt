from sqlalchemy.orm import Session
from sqlalchemy import func
import app.schemas.orm as orm

class LeaderboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_leaderboard(self):
        return (
            self.db.query(
                orm.Player.id,
                orm.Player.name,
                func.coalesce(func.sum(orm.Team.score), 0).label("cumulative_score"),
            )
            .join(orm.player_team_association, orm.Player.id == orm.player_team_association.c.player_id)
            .join(orm.Team, orm.player_team_association.c.team_id == orm.Team.id)
            .group_by(orm.Player.id, orm.Player.name)
            .order_by(func.sum(orm.Team.score).desc())
            .all()
        )

    def get_tournament_leaderboard(self, tournament_id: str):
        return (
            self.db.query(
                orm.Player.id,
                orm.Player.name,
                orm.Player.email,
                func.coalesce(func.sum(orm.Team.score), 0).label("cumulative_score"),
            )
            .join(orm.player_team_association, orm.Player.id == orm.player_team_association.c.player_id)
            .join(orm.Team, orm.player_team_association.c.team_id == orm.Team.id)
            .join(orm.Match, orm.Team.match_id == orm.Match.id)
            .join(orm.Round, orm.Match.round_id == orm.Round.id)
            .join(orm.Tournament, orm.Round.tournament_id == orm.Tournament.id)
            .filter(orm.Tournament.id == tournament_id)
            .group_by(orm.Player.id, orm.Player.name, orm.Player.email)
            .order_by(func.sum(orm.Team.score).desc())
            .all()
        )
