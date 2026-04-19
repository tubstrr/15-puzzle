#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$HOME/apps/15-puzzle"
LOG_FILE="$APP_DIR/deploy.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

{
  log "=== Deploy started ==="

  cd "$APP_DIR"

  log "Pulling latest code..."
  git pull origin main

  log "Building and restarting container..."
  docker compose -f etc/configs/production/docker-compose.yml build
  docker compose -f etc/configs/production/docker-compose.yml up -d --force-recreate

  log "=== Deploy complete ==="
} 2>&1 | tee -a "$LOG_FILE"
