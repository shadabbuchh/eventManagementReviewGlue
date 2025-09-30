#!/usr/bin/env bash

# Purpose: Run preflight checks to ensure codegen output is clean and ready.
# This wraps the TypeScript preflight script and the generated types existence check
# in a maintainable, well-documented shell script instead of a long inline npm command.

set -Eeuo pipefail

# Resolve repository paths relative to this script location
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
APP_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

# Always execute from the app-template root so relative paths in the TS script work
cd "$APP_DIR"

echo "[preflight] Running code hygiene checks (TS)"

# Run the TypeScript preflight scanner. It validates:
# - Hidden/invalid unicode, leftover template tokens
# - Disallowed .js imports in TS/TSX
# - Suspicious escaped quotes
# - Presence of any *.template.ts in src
# - Disallowed `any` in source files (not in .d.ts)
# - Ensures generated types exist (also checked below for clearer messaging)
tsx scripts/preflight.ts

# Double-check the generated API types exist with a clear, actionable message.
# Keeping this here makes the requirement obvious and the command easy to discover.
if [[ ! -f "openapi/generated-types.d.ts" ]]; then
  echo "" >&2
  echo "[preflight] Missing generated API types: openapi/generated-types.d.ts" >&2
  echo "[preflight] To generate: cd openapi && pnpm generate-types" >&2
  exit 1
fi

echo "[preflight] All checks passed."


