import asyncio
import os

from litestar import get
from litestar.response import Response
from litestar.status_codes import HTTP_200_OK, HTTP_503_SERVICE_UNAVAILABLE
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker


@get("/health")
async def health_check() -> dict:
    """Basic health check endpoint that doesn't require database."""
    return {"status": "healthy", "service": "ttt-backend", "message": "Service is running"}


@get("/health/ready")
async def readiness_check() -> Response:
    """Readiness check that includes database connectivity with timeout."""
    try:
        # Create a database connection with timeout
        database_url = os.getenv("DATABASE_URL", "postgresql+psycopg2://user:user@db:5432/ttt")

        async def check_db():
            # Create engine with short timeout settings
            engine = create_engine(
                database_url,
                pool_timeout=2,  # 2 seconds to get connection from pool
                pool_recycle=30,  # Recycle connections after 30 seconds
                connect_args={
                    "connect_timeout": 3,  # 3 seconds to establish connection
                },
            )

            Session = sessionmaker(bind=engine)
            session = Session()

            try:
                # Simple database connectivity test
                result = session.execute(text("SELECT 1")).fetchone()
                return result is not None
            finally:
                session.close()
                engine.dispose()

        # Wait for database check with 5-second timeout
        db_healthy = await asyncio.wait_for(check_db(), timeout=5.0)

        if db_healthy:
            return Response(
                content={
                    "status": "ready",
                    "service": "ttt-backend",
                    "database": "connected",
                    "message": "Service is ready to accept requests",
                },
                status_code=HTTP_200_OK,
            )
        else:
            raise Exception("Database query returned no results")

    except asyncio.TimeoutError:
        return Response(
            content={
                "status": "not_ready",
                "service": "ttt-backend",
                "database": "timeout",
                "error": "Database connection timed out after 5 seconds",
                "message": "Service is not ready - database connection timeout",
            },
            status_code=HTTP_503_SERVICE_UNAVAILABLE,
        )
    except Exception as e:
        return Response(
            content={
                "status": "not_ready",
                "service": "ttt-backend",
                "database": "disconnected",
                "error": str(e),
                "message": "Service is not ready - database connection failed",
            },
            status_code=HTTP_503_SERVICE_UNAVAILABLE,
        )
