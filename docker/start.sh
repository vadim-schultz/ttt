#!/usr/bin/env bash
#
# Build and start Docker Compose with proxy/registry settings from .env
# Always rebuilds containers on each run.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -f "${SCRIPT_DIR}/.env" ]]; then
  echo "Error: .env file not found at ${SCRIPT_DIR}/.env" >&2
  echo "Please create docker/.env with proxy and registry settings." >&2
  exit 1
fi

echo "Building and starting containers..."
docker compose --env-file "${SCRIPT_DIR}/.env" -f "${SCRIPT_DIR}/compose.yml" up --build
