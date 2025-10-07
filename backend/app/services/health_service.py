import asyncio
from app.repositories.health_repository import HealthRepository

class HealthService:
    def __init__(self, repo: HealthRepository):
        self.repo = repo

    async def check_db_ready(self, timeout=5.0):
        try:
            db_healthy = await asyncio.wait_for(
                asyncio.to_thread(self.repo.check_db), timeout=timeout
            )
            return db_healthy
        except asyncio.TimeoutError:
            return "timeout"
        except Exception as e:
            return str(e)
