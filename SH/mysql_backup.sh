#!/bin/bash

# Script Configuration:
# 	Create a file /root/.my.cnf with permission 600 and the following content for your credentials:
# 		[client]
# 		user=mysql_user
# 		password=mysql_user_password
#
# Create a Cron to execute the script when desired with `sudo crontab -e`. Example of a backup at 3AM every day:
# 	0 3 * * * /usr/local/bin/mysql_backup.sh

# Directory used to store the files and zip generated from the backup.
BACKUP_DIR="/home/erione/backups_mysql"
# Directory where the execution logs will be stored.
LOG_FILE="/var/log/mysql_backup.log"
# Directory where the MySQL credentials will be stored.
MYSQL_CNF="/root/.my.cnf"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Function to check for corrupted tables
check_corrupted_tables() {
    # Get total table count for progress reporting
    total_tables=$(mysql --defaults-file=$MYSQL_CNF -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')" -s)
    current_table=0
    
    # Get all tables from all databases except system schemas
    mysql --defaults-file=$MYSQL_CNF -e "SELECT CONCAT(table_schema, '.', table_name) FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')" -s | while read table; do
        current_table=$((current_table + 1))
        log "Checking table ${current_table}/${total_tables}: $table"
        
        # Check each table for errors
        result=$(mysql --defaults-file=$MYSQL_CNF -e "CHECK TABLE $table EXTENDED" -s 2>&1 | grep -i "error\|corrupt\|warning\|crash")
        
        if [ -n "$result" ]; then
            log "Problem found with table $table: $result"
            echo "$table" >> "$BACKUP_DIR/corrupted_tables_$TIMESTAMP.tmp"
        else
            log "Table $table is OK"
        fi
    done
    
    # If we found corrupted tables, format them for ignore parameters
    if [ -f "$BACKUP_DIR/corrupted_tables_$TIMESTAMP.tmp" ]; then
        cat "$BACKUP_DIR/corrupted_tables_$TIMESTAMP.tmp" | while read table; do
            echo "--ignore-table=$table"
        done | tr '\n' ' '
        rm "$BACKUP_DIR/corrupted_tables_$TIMESTAMP.tmp"
    fi
}

log "Starting MySQL backup process..."
log "Checking table integrity..."

# Check for corrupted tables and build ignore parameters
IGNORE_PARAMS=$(check_corrupted_tables)

log "Starting MySQL backup..."

if mysqldump --defaults-file=$MYSQL_CNF \
             --all-databases \
             $IGNORE_PARAMS \
             --single-transaction \
             --quick \
             --force \
             --no-tablespaces | gzip > "$BACKUP_DIR/mysql_backup_$TIMESTAMP.sql.gz"; then
    log "Backup completed successfully: mysql_backup_$TIMESTAMP.sql.gz"

    if [ -n "$IGNORE_PARAMS" ]; then
        echo "Skipped tables due to corruption issues:" > "$BACKUP_DIR/mysql_backup_$TIMESTAMP.skipped_tables.txt"
        # Extract table names from ignore parameters
        echo "$IGNORE_PARAMS" | tr ' ' '\n' | grep "ignore-table" | cut -d'=' -f2 >> "$BACKUP_DIR/mysql_backup_$TIMESTAMP.skipped_tables.txt"
        log "Skipped tables list saved to backup directory"
    fi

    find "$BACKUP_DIR" -name "mysql_backup_*.sql.gz" -type f -mtime +7 -delete
    log "Deleted backups older than 7 days"
else
    log "Backup failed!"
    exit 1
fi

log "MySQL backup process completed"