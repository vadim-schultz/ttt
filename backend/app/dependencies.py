from collections.abc import Generator

from litestar.di import Provide
from sqlalchemy.orm import Session, sessionmaker

from app.repositories.health_repository import HealthRepository
from app.repositories.leaderboard_repository import LeaderboardRepository
from app.repositories.player_repository import PlayerRepository
from app.repositories.score_repository import ScoreRepository
from app.repositories.tournament_repository import TournamentRepository
from app.services.db import db_instance, get_db_session
from app.services.health_service import HealthService
from app.services.leaderboard_service import LeaderboardService
from app.services.player_service import PlayerService
from app.services.score_service import ScoreService
from app.services.tournament_service import TournamentService


def provide_session_factory() -> sessionmaker:
    return db_instance.session_local


def provide_health_repository(session_factory: sessionmaker) -> HealthRepository:
    return HealthRepository(session_factory)


def provide_health_service(health_repository: HealthRepository) -> HealthService:
    return HealthService(health_repository)


def provide_db_session() -> Generator[Session, None, None]:
    yield from get_db_session()


def provide_tournament_repository(db: Session) -> TournamentRepository:
    return TournamentRepository(db)


def provide_player_repository(db: Session) -> PlayerRepository:
    return PlayerRepository(db)


def provide_tournament_service(tournament_repository: TournamentRepository) -> TournamentService:
    return TournamentService(tournament_repository)


def provide_player_service(player_repository: PlayerRepository) -> PlayerService:
    return PlayerService(player_repository)


def provide_score_repository(db: Session) -> ScoreRepository:
    return ScoreRepository(db)


def provide_score_service(score_repository: ScoreRepository) -> ScoreService:
    return ScoreService(score_repository)


def provide_leaderboard_repository(db: Session) -> LeaderboardRepository:
    return LeaderboardRepository(db)


def provide_leaderboard_service(leaderboard_repository: LeaderboardRepository) -> LeaderboardService:
    return LeaderboardService(leaderboard_repository)


dependencies = {
    "session_factory": Provide(provide_session_factory, sync_to_thread=True),
    "health_repository": Provide(provide_health_repository, sync_to_thread=True),
    "health_service": Provide(provide_health_service, sync_to_thread=True),
    "db": Provide(provide_db_session, sync_to_thread=True),
    "tournament_repository": Provide(provide_tournament_repository, sync_to_thread=True),
    "player_repository": Provide(provide_player_repository, sync_to_thread=True),
    "score_repository": Provide(provide_score_repository, sync_to_thread=True),
    "leaderboard_repository": Provide(provide_leaderboard_repository, sync_to_thread=True),
    "tournament_service": Provide(provide_tournament_service, sync_to_thread=True),
    "player_service": Provide(provide_player_service, sync_to_thread=True),
    "score_service": Provide(provide_score_service, sync_to_thread=True),
    "leaderboard_service": Provide(provide_leaderboard_service, sync_to_thread=True),
}
