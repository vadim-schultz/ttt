#!/bin/bash

# TTT Database State Verification Script
# This script helps verify the current state of your database

CONTAINER_NAME="ttt-db"
DB_NAME="ttt"
DB_USER="user"
DB_PASSWORD="user"

echo "=== TTT Database State Report ==="
echo "Generated on: $(date)"
echo ""

# Check if database container is running
if ! docker ps --format "table {{.Names}}" | grep -q "$CONTAINER_NAME"; then
    echo "❌ Database container '$CONTAINER_NAME' is not running!"
    exit 1
fi

echo "✅ Database container is running"
echo ""

# Get basic database statistics
echo "=== Database Statistics ==="
echo "Tournaments:"
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as total_tournaments FROM tournaments;" -t | tr -d ' '

echo ""
echo "Players:"
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as total_players FROM players;" -t | tr -d ' '

echo ""
echo "Matches:"
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as total_matches FROM matches;" -t | tr -d ' '

echo ""
echo "=== Tournament Details ==="
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT t.name as tournament, COUNT(p.id) as registered_players, t.status FROM tournaments t LEFT JOIN tournament_players tp ON t.id = tp.tournament_id LEFT JOIN players p ON tp.player_id = p.id GROUP BY t.id, t.name, t.status ORDER BY t.name;"

echo ""
echo "=== Recent Players ==="
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT name, email FROM players ORDER BY name LIMIT 10;"

echo ""
echo "=== Database Size ==="
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as database_size;"

echo ""
echo "=== Available Backups ==="
BACKUP_DIR="/home/eckar_fl/backups/ttt"
if [ -d "$BACKUP_DIR" ]; then
    echo "Backup files in $BACKUP_DIR:"
    ls -lht "$BACKUP_DIR"/ttt_backup_* 2>/dev/null | head -5
else
    echo "No backup directory found at $BACKUP_DIR"
fi

echo ""
echo "=== End of Report ==="