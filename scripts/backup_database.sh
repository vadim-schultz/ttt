#!/bin/bash

# TTT PostgreSQL Backup Script
# This script creates consistent database backups using pg_dump

# Configuration
BACKUP_DIR="/home/eckar_fl/backups/ttt"
DATE=$(date +"%Y%m%d_%H%M%S")
CONTAINER_NAME="ttt-db"
DB_NAME="ttt"
DB_USER="user"
DB_PASSWORD="user"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting PostgreSQL backup at $(date)"

# Method 1: Using pg_dump through Docker (RECOMMENDED)
echo "Creating SQL dump backup..."
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists > "$BACKUP_DIR/ttt_backup_${DATE}.sql"

# Method 2: Custom format backup (smaller, faster restore)
echo "Creating custom format backup..."
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" -Fc > "$BACKUP_DIR/ttt_backup_${DATE}.custom"

# Method 3: Gzipped SQL backup (compressed)
echo "Creating compressed SQL backup..."
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip > "$BACKUP_DIR/ttt_backup_${DATE}.sql.gz"

# Check if backups were created successfully
if [ -f "$BACKUP_DIR/ttt_backup_${DATE}.sql" ] && [ -s "$BACKUP_DIR/ttt_backup_${DATE}.sql" ]; then
    echo "✅ SQL backup created successfully: $BACKUP_DIR/ttt_backup_${DATE}.sql"
else
    echo "❌ SQL backup failed!"
    exit 1
fi

if [ -f "$BACKUP_DIR/ttt_backup_${DATE}.custom" ] && [ -s "$BACKUP_DIR/ttt_backup_${DATE}.custom" ]; then
    echo "✅ Custom backup created successfully: $BACKUP_DIR/ttt_backup_${DATE}.custom"
else
    echo "❌ Custom backup failed!"
fi

if [ -f "$BACKUP_DIR/ttt_backup_${DATE}.sql.gz" ] && [ -s "$BACKUP_DIR/ttt_backup_${DATE}.sql.gz" ]; then
    echo "✅ Compressed backup created successfully: $BACKUP_DIR/ttt_backup_${DATE}.sql.gz"
else
    echo "❌ Compressed backup failed!"
fi

# Optional: Remove backups older than 30 days
echo "Cleaning up old backups (older than 30 days)..."
find "$BACKUP_DIR" -name "ttt_backup_*.sql" -type f -mtime +30 -delete
find "$BACKUP_DIR" -name "ttt_backup_*.custom" -type f -mtime +30 -delete
find "$BACKUP_DIR" -name "ttt_backup_*.sql.gz" -type f -mtime +30 -delete

echo "Backup completed at $(date)"
echo "Backup files saved to: $BACKUP_DIR"
ls -lh "$BACKUP_DIR"/ttt_backup_${DATE}*