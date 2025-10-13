from litestar import Controller, Request, post

from app.services.score_service import ScoreService

class ScoreController(Controller):
    path = "/score"

    @post("/")
    async def update_score(self, request: Request, score_service: ScoreService) -> dict:
        form_data = await request.form()
        return await score_service.update_score(form_data)
