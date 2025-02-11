#!/bin/bash

# Define the source file and the backup directory
SOURCE_FILE="/home/eckar_fl/Documents/ttt_server/ttt.db"
BACKUP_DIR="/home/eckar_fl/Documents/ttt_server/bak"

# Get the current timestamp
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Define the backup file name with the timestamp
BACKUP_FILE="$BACKUP_DIR/ttt_$TIMESTAMP.db"

# Copy the file to the backup directory with the new name
cp "$SOURCE_FILE" "$BACKUP_FILE"
