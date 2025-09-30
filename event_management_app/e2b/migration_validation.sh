#!/bin/sh

set -eux

# Migration validation script for E2B sandbox environment
# This script validates database migrations by running them directly
# without starting the backend server

# Configuration - Force these values to override any environment variables
unset DB_PORT POSTGRES_PORT  # Clear any existing environment variables
DB_NAME="migration_validation_db"
DB_HOST="localhost"
DB_PORT="5432"
BACKEND_PATH="$1"

# Export to ensure our values are used by subcommands
export DB_NAME DB_HOST DB_PORT

# Set validation database URL for migration runner (will be passed as env var to the process)
VALIDATION_DATABASE_URL="postgresql://postgres@$DB_HOST:$DB_PORT/$DB_NAME"

if [ -z "$BACKEND_PATH" ]; then
    echo "Usage: $0 <backend_path>"
    exit 1
fi

echo "Starting migration validation for backend at: $BACKEND_PATH"

# Initialize cleanup variables
VALIDATION_SUCCESS=false

# Cleanup function - always called on exit
cleanup() {
    echo "Cleaning up..."
    psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true
    echo "Cleanup complete!"
}

# Set trap to ensure cleanup runs on any exit
trap cleanup EXIT

# Verify PostgreSQL is accessible
echo "Verifying PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U postgres >/dev/null 2>&1; then
    echo "ERROR: Cannot connect to PostgreSQL on $DB_HOST:$DB_PORT"
    echo "Please ensure PostgreSQL is running and accessible"
    echo "This is an infrastructure error that cannot be fixed by modifying migrations"
    exit 3  # Exit code 3 = Infrastructure error, skip fixer
fi

echo "PostgreSQL is ready!"

# Create validation database
echo "Setting up validation database..."
psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true

if ! psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null; then
    echo "ERROR: Failed to create validation database"
    echo "This is an infrastructure/permissions error that cannot be fixed by modifying migrations"
    exit 3  # Exit code 3 = Infrastructure error, skip fixer
fi

# Run migrations directly using Drizzle
echo "Running database migrations..."
cd "$BACKEND_PATH"

# Run migrations using pnpm db:migrate (Drizzle)
# Explicitly override APP_DATABASE_URL for this process
echo "Using validation database URL: $VALIDATION_DATABASE_URL"
APP_DATABASE_URL="$VALIDATION_DATABASE_URL" pnpm db:migrate
migration_exit_code=$?

if [ $migration_exit_code -ne 0 ]; then
    echo "ERROR: Migration validation failed (exit code: $migration_exit_code)"
    echo "This is a migration error that can potentially be fixed"
    exit 1  # Exit code 1 = Migration error, can be fixed
fi

echo "Migrations completed successfully!"

VALIDATION_SUCCESS=true
echo "Migration validation completed successfully!"