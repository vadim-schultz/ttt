from litestar import Controller, get, Response, status_codes
from litestar.di import Provide
from app.services.health_service import HealthService

# Dependency provider

def provide_health_service() -> HealthService:
    from app.repositories.health_repository import HealthRepository
    return HealthService(HealthRepository())

class HealthController(Controller):
    path = "/health"

    @get("/")
    async def health_check(self) -> dict:
        return {"status": "healthy", "service": "ttt-backend", "message": "Service is running"}

    @get("/ready", dependencies={"service": Provide(provide_health_service, sync_to_thread=False)})
    async def readiness_check(self, service: HealthService) -> Response:
        db_status = await service.check_db_ready()
        if db_status is True:
            return Response(
                content={
                    "status": "ready",
                    "service": "ttt-backend",
                    "database": "connected",
                    "message": "Service is ready to accept requests",
                },
                status_code=status_codes.HTTP_200_OK,
            )
        elif db_status == "timeout":
            return Response(
                content={
                    "status": "not_ready",
                    "service": "ttt-backend",
                    "database": "timeout",
                    "error": "Database connection timed out after 5 seconds",
                    "message": "Service is not ready - database connection timeout",
                },
                status_code=status_codes.HTTP_503_SERVICE_UNAVAILABLE,
            )
        else:
            return Response(
                content={
                    "status": "not_ready",
                    "service": "ttt-backend",
                    "database": "disconnected",
                    "error": str(db_status),
                    "message": "Service is not ready - database connection failed",
                },
                status_code=status_codes.HTTP_503_SERVICE_UNAVAILABLE,
            )
