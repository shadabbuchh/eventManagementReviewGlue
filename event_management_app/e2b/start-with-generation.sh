#!/bin/sh

# Enhanced start script that starts processes from the EFS app path directly
# Usage: ./start-with-generation.sh <efs_app_path>

set -eux

if [ $# -ne 1 ]; then
    echo "Usage: $0 <efs_app_path>"
    echo "Example: $0 /efs/org_user_123/apps/app_456"
    exit 1
fi

EFS_APP_PATH="$1"

cd /top

export PATH="$PWD/node/bin:$PATH"

# Stop any existing PM2 processes
pm2 stop all || true
pm2 delete all || true

# Ensure logs directory exists in the EFS app path
mkdir -p "$EFS_APP_PATH/logs"

# Create a temporary ecosystem config that uses the actual EFS app path
cat > /tmp/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "$EFS_APP_PATH/frontend",
      script: "node_modules/.bin/vite",
      args: ["dev", "--host", "0.0.0.0"],
      interpreter: "/bin/sh",
      env: {
        __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS: ".e2b.app",
      },
      log_file: "$EFS_APP_PATH/logs/frontend.log",
      time: true,
      watch: false,
    },
    {
      name: "backend",
      cwd: "$EFS_APP_PATH/backend",
      script: "node_modules/.bin/tsx",
      args: ["watch", "src/server.ts"],
      interpreter: "/bin/sh",
      log_file: "$EFS_APP_PATH/logs/backend.log",
      time: true,
      watch: false,
    },
    {
      name: "caddy",
      cwd: "$EFS_APP_PATH",
      script: "/usr/local/bin/caddy",
      args: ["run", "--config", "$EFS_APP_PATH/e2b/Caddyfile"],
      log_file: "$EFS_APP_PATH/logs/caddy.log",
      watch: false,
    },
  ],
};
EOF

# Start PM2 processes with the temporary ecosystem config
node/bin/pm2 start /tmp/ecosystem.config.js
