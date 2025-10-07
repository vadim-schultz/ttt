from litestar import Controller, post, Request
from litestar.di import Provide
from sqlalchemy.orm import Session
from app.services.db import get_db_session
from app.services.score_service import ScoreService

# Dependency provider

def provide_score_service(db: Session = Provide(get_db_session)) -> ScoreService:
    from app.repositories.score_repository import ScoreRepository
    return ScoreService(ScoreRepository(db))

class ScoreController(Controller):
    path = "/score"

    @post("/", dependencies={"service": Provide(provide_score_service)})
    async def update_score(self, request: Request, service: ScoreService) -> dict:
        form_data = await request.form()
        return await service.update_score(form_data)
