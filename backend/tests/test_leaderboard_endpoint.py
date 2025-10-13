from datetime import date

from litestar.testing import TestClient

from app.config import create_app
from app.schemas.orm import Match, Player, Round, Team, Tournament
from app.services.db import db_instance


def test_leaderboard_endpoint_includes_email(tmp_path):
    original_url = db_instance._database_url
    original_engine = db_instance._engine
    original_session_local = db_instance._session_local

    db_instance._database_url = f"sqlite:///{tmp_path / 'leaderboard.db'}"
    db_instance._engine = None
    db_instance._session_local = None

    try:
        app = create_app()

        with TestClient(app) as client:
            session_factory = db_instance.session_local
            with session_factory() as session:
                tournament = Tournament(name="Test Tournament", start_date=date.today())
                session.add(tournament)

                round_obj = Round(round_number=1, tournament_id=tournament.id)
                session.add(round_obj)

                match = Match(round_id=round_obj.id)
                session.add(match)

                team = Team(match_id=match.id, score=15)
                session.add(team)

                player = Player(name="Alice", email="alice@example.com")
                session.add(player)
                session.flush()

                team.players.append(player)
                session.commit()

            response = client.get("/leaderboard/")
            assert response.status_code == 200
            payload = response.json()
            assert payload
            assert payload[0]["email"] == "alice@example.com"
    finally:
        if db_instance._engine is not None:
            db_instance._engine.dispose()
        db_instance._database_url = original_url
        db_instance._engine = original_engine
        db_instance._session_local = original_session_local
