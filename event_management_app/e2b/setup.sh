#!/bin/sh

set -eux

apt-get update && apt-get install -y curl python3 python3-pip || true

# Create /usr/local/bin directory first
mkdir -p /usr/local/bin

# Install Caddy
curl --location --fail 'https://github.com/caddyserver/caddy/releases/download/v2.10.0/caddy_2.10.0_linux_amd64.tar.gz' \
  | tar -C /usr/local/bin -xz caddy

# Install Node.js
mkdir -p node
arch="$(uname -m | sed 's/x86_64/x64/; s/aarch64/arm64/')"
curl -sS "https://nodejs.org/dist/v22.17.1/node-v22.17.1-linux-$arch.tar.gz" \
  | tar -xz -C node --strip-components 1

# Add node/bin to PATH for this session
export PATH="$PWD/node/bin:$PATH"

# Install PM2
npm install -g pm2

# Generated code requires pnpm "~10.14.0" (see app-template/package.json engines field)
npm install -g @anthropic-ai/claude-code pnpm@10.14.0

# Install Gemini CLI for analysis and brainstorming
npm install -g @google/gemini-cli

# Create symlinks for all node/bin executables (including pm2 and pnpm)
# include both files (-type f) and symlinks (-type l)
find "$PWD/node/bin" -maxdepth 1 \( -type f -o -type l \) -exec ln -vsf '{}' /usr/local/bin/ ';'

# Test that tools are working via symlinks
node --version
pnpm --version
pm2 --version

# Create python symlink for convenience
ln -sf /usr/bin/python3 /usr/local/bin/python

# Install git for diff-based file synchronization
apt-get install -y git

# Install PostgreSQL for migration validation
apt-get install -y postgresql postgresql-contrib

# Configure PostgreSQL for sandbox use
# Use default port 5432 for simplicity
PG_VERSION="$(ls /etc/postgresql/)"
PG_CONFIG_DIR="/etc/postgresql/$PG_VERSION/main"

# Create the postgresql.conf.d directory if it doesn't exist
mkdir -p "$PG_CONFIG_DIR/postgresql.conf.d"

# Create sandbox configuration (using default port 5432)
cat > "$PG_CONFIG_DIR/postgresql.conf.d/sandbox.conf" << EOF
shared_buffers = 64MB
work_mem = 1MB
maintenance_work_mem = 16MB
max_connections = 20
EOF

# Update pg_hba.conf to allow local connections without password
cat > "$PG_CONFIG_DIR/pg_hba.conf" << EOF
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
EOF

# PostgreSQL is now installed and configured
# It will be started at runtime by start.sh
echo "PostgreSQL installation and configuration complete!"
echo "PostgreSQL will be started at runtime by start.sh"

# Install Python packages
pip3 install --no-cache-dir sqlfluff

# Test Python installation
python3 --version

# Clean up pip and build dependencies to keep container lightweight
# Note: python3-setuptools and python3-wheel are auto-installed with python3-pip
apt-get remove -y python3-pip
apt-get autoremove -y  # Removes orphaned dependencies like setuptools, wheel, and build tools
apt-get clean          # Clears apt cache

# Create essential directories for file synchronization
# These directories need to be writable by the user for proper file operations
mkdir -p /efs
# Note: Permissions will be set at runtime in start.sh

# Install dependencies at workspace root
cd /top && pnpm install
