from litestar import Controller, Response, get, status_codes
from app.services.health_service import HealthService

class HealthController(Controller):
    path = "/health"

    @get("/")
    async def health_check(self) -> dict:
        return {"status": "healthy", "service": "ttt-backend", "message": "Service is running"}

    @get("/ready")
    async def readiness_check(self, health_service: HealthService) -> Response:
        db_status = await health_service.check_db_ready()
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
