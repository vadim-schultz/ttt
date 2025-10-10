#!/bin/bash

# TTT PostgreSQL Restore Script
# This script restores database backups created by backup_database.sh

# Configuration
BACKUP_DIR="/home/eckar_fl/backups/ttt"
CONTAINER_NAME="ttt-db"
DB_NAME="ttt"
DB_USER="user"
DB_PASSWORD="user"

# Usage function
usage() {
    echo "Usage: $0 <backup_file>"
    echo ""
    echo "Examples:"
    echo "  $0 /path/to/ttt_backup_20250917_143022.sql"
    echo "  $0 /path/to/ttt_backup_20250917_143022.custom"
    echo "  $0 /path/to/ttt_backup_20250917_143022.sql.gz"
    echo ""
    echo "Available backups:"
    ls -lt "$BACKUP_DIR"/ttt_backup_* 2>/dev/null | head -10
}

# Check if backup file is provided
if [ $# -eq 0 ]; then
    usage
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Starting database restore from: $BACKUP_FILE"
echo "⚠️  WARNING: This will OVERWRITE the current database!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled."
    exit 1
fi

# Stop the backend to prevent connections during restore
echo "Stopping backend container..."
cd /home/eckar_fl/projects/ttt
docker compose -f docker/compose.yml stop backend

# Wait a moment for connections to close
sleep 2

# Drop and recreate the database to ensure a clean restore
echo "Dropping and recreating database for clean restore..."
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "postgres" -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "postgres" -c "CREATE DATABASE $DB_NAME;"

# Determine backup file type and restore accordingly
if [[ "$BACKUP_FILE" == *.sql.gz ]]; then
    echo "Restoring from compressed SQL backup..."
    gunzip -c "$BACKUP_FILE" | docker exec -i -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"
elif [[ "$BACKUP_FILE" == *.custom ]]; then
    echo "Restoring from custom format backup..."
    docker exec -i -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" pg_restore -U "$DB_USER" -d "$DB_NAME" --clean --if-exists < "$BACKUP_FILE"
elif [[ "$BACKUP_FILE" == *.sql ]]; then
    echo "Restoring from SQL backup..."
    docker exec -i -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"
else
    echo "❌ Unsupported backup file format: $BACKUP_FILE"
    echo "Supported formats: .sql, .sql.gz, .custom"
    exit 1
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "✅ Database restore completed successfully!"
else
    echo "❌ Database restore failed!"
    exit 1
fi

# Restart the backend
echo "Restarting backend container..."
docker compose -f docker/compose.yml start backend

echo "🎉 Database restore process completed!"
echo "You can now access your application at http://localhost:8001"