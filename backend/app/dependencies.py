from litestar.di import Provide
from sqlalchemy.orm import Session
from app.services.db import get_db_session
from app.repositories.tournament_repository import TournamentRepository
from app.repositories.player_repository import PlayerRepository
from app.services.tournament_service import TournamentService
from app.services.player_service import PlayerService
from app.repositories.score_repository import ScoreRepository
from app.services.score_service import ScoreService
from app.repositories.leaderboard_repository import LeaderboardRepository
from app.services.leaderboard_service import LeaderboardService
from app.repositories.health_repository import HealthRepository
from app.services.health_service import HealthService

# Dependency providers

def provide_health_repository() -> HealthRepository:
    return HealthRepository()

def provide_health_service(repo: HealthRepository = Provide(provide_health_repository)) -> HealthService:
    return HealthService(repo)

def provide_db_session() -> Session:
    return get_db_session()

def provide_tournament_repository(db: Session = Provide(provide_db_session)) -> TournamentRepository:
    return TournamentRepository(db)

def provide_player_repository(db: Session = Provide(provide_db_session)) -> PlayerRepository:
    return PlayerRepository(db)

def provide_tournament_service(repo: TournamentRepository = Provide(provide_tournament_repository)) -> TournamentService:
    return TournamentService(repo)

def provide_player_service(repo: PlayerRepository = Provide(provide_player_repository)) -> PlayerService:
    return PlayerService(repo)

def provide_score_repository(db: Session = Provide(provide_db_session)) -> ScoreRepository:
    return ScoreRepository(db)

def provide_score_service(repo: ScoreRepository = Provide(provide_score_repository)) -> ScoreService:
    return ScoreService(repo)

def provide_leaderboard_repository(db: Session = Provide(provide_db_session)) -> LeaderboardRepository:
    return LeaderboardRepository(db)

def provide_leaderboard_service(repo: LeaderboardRepository = Provide(provide_leaderboard_repository)) -> LeaderboardService:
    return LeaderboardService(repo)

# Collect all providers in a single dict for Litestar

dependencies = {
    "db": Provide(provide_db_session),
    "tournament_repository": Provide(provide_tournament_repository),
    "player_repository": Provide(provide_player_repository),
    "score_repository": Provide(provide_score_repository),
    "leaderboard_repository": Provide(provide_leaderboard_repository),
    "health_repository": Provide(provide_health_repository),
    "tournament_service": Provide(provide_tournament_service),
    "player_service": Provide(provide_player_service),
    "score_service": Provide(provide_score_service),
    "leaderboard_service": Provide(provide_leaderboard_service),
    "health_service": Provide(provide_health_service),
}
