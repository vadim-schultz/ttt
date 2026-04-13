# Use public Docker Hub by default; override via build args for corporate pull-through cache.
ARG DOCKER_REGISTRY=docker.io

FROM ${DOCKER_REGISTRY}/library/ubuntu:24.04

WORKDIR /app

# Optional proxy and PyPI settings (passed via compose build args / .env)
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ARG PYPI_INDEX_URL
ARG PYPI_EXTRA_INDEX_URL

RUN apt-get --yes update && apt-get --yes install python3 python3-pip python3-venv git

# System-wide pip config so non-root installs also use corporate indexes when provided.
RUN if [ -n "$PYPI_INDEX_URL" ]; then \
        printf '[global]\ndisable-pip-version-check = true\nindex = %s\nindex-url = %s\n' "$PYPI_INDEX_URL" "$PYPI_INDEX_URL" > /etc/pip.conf && \
        if [ -n "$PYPI_EXTRA_INDEX_URL" ]; then printf 'extra-index-url = %s\n' "$PYPI_EXTRA_INDEX_URL" >> /etc/pip.conf; fi; \
    fi

RUN groupadd -r user && useradd --no-log-init -r -g user user

COPY backend /app/backend

COPY .git /app/.git

WORKDIR /app/

RUN chown --recursive user:user /app

USER user

RUN python3 -m venv venv && . ./venv/bin/activate && pip install ./backend/

EXPOSE 8000

ENTRYPOINT ["/bin/bash", "-c"]
CMD [". ./venv/bin/activate && cd backend && alembic upgrade head && run-backend"]
