#!/bin/sh

cd /top

export PATH="$PWD/node/bin:$PATH"

# Set proper permissions for directories
chown -R user:user /top /efs /generation || true

# Ensure PostgreSQL is running for migration validation
# PostgreSQL should already be installed and configured from setup.sh
# First check if PostgreSQL is installed
if ! command -v pg_isready >/dev/null 2>&1; then
    echo "ERROR: PostgreSQL is not installed. Please check setup.sh installation."
    exit 1
fi

# Start PostgreSQL (it's not running since setup.sh only installs/configures)
echo "Starting PostgreSQL..."
if command -v systemctl >/dev/null 2>&1; then
    systemctl start postgresql
elif command -v service >/dev/null 2>&1; then
    service postgresql start
else
    echo "WARNING: Neither systemctl nor service commands are available"
    echo "PostgreSQL may need to be started manually or may not be properly installed"
    echo "Continuing anyway - migration validation may fail if PostgreSQL is not running"
fi

# Wait for PostgreSQL to be ready
echo "Verifying PostgreSQL is ready..."
MAX_WAIT_TIME=30
WAIT_COUNT=0

while ! pg_isready -h localhost -p 5432 -U postgres >/dev/null 2>&1 && [ $WAIT_COUNT -lt $MAX_WAIT_TIME ]; do
    echo "PostgreSQL is not ready yet, waiting... ($((WAIT_COUNT + 1))/$MAX_WAIT_TIME)"
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
done

if [ $WAIT_COUNT -eq $MAX_WAIT_TIME ]; then
    echo "WARNING: PostgreSQL failed to start within $MAX_WAIT_TIME seconds"
    echo "Continuing without PostgreSQL - migration validation may not work"
fi

echo "PostgreSQL is ready!"

# Create validation database template if it doesn't exist (only if PostgreSQL is running)
if pg_isready -h localhost -p 5432 -U postgres >/dev/null 2>&1; then
    echo "Ensuring validation database template exists..."
    sudo -u postgres psql -h localhost -p 5432 -c "CREATE DATABASE validation_template;" 2>/dev/null || echo "Validation database template already exists or creation failed"
else
    echo "PostgreSQL is not running, skipping database template creation"
fi

exec sudo -u user node/bin/pm2-runtime start e2b/ecosystem.config.js
