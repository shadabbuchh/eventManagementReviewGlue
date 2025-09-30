ARG NODE_VERSION=22.17.1
# Base stage with pnpm installed
FROM node:${NODE_VERSION}-alpine AS base
RUN npm install -g pnpm

FROM base AS frontend

WORKDIR /app/frontend

COPY frontend .

RUN <<EOF
set -xeu
pnpm install
pnpm run build
EOF

FROM base AS backend

WORKDIR /app/backend

COPY backend .

RUN <<EOF
set -xeu
pnpm install
npx tsc --outDir dist --sourceMap true --noEmit false
EOF

FROM base

WORKDIR /app

# We need a way to load the environment vars from the deployment, but that doesn't exist yet
COPY backend/.env .

# Copy package.json for production dependencies
COPY backend/package*.json .

# Copy compiled JavaScript files and sourcemaps from backend stage to src/
COPY --from=backend /app/backend/dist .

# Copy built frontend
COPY --from=frontend /app/frontend/dist ./public

RUN <<EOF
set -xeu
mkdir -p logs
pnpm install --production
EOF

EXPOSE 3001

CMD ["node", "--enable-source-maps", "src/server.js"]
