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

  log "Building image..."
  sudo DOCKER_CONFIG=/tmp docker buildx build -t 15-puzzle:latest -f etc/configs/production/Dockerfile --load src/nuxt

  log "Restarting container..."
  sudo docker stop 15-puzzle 2>/dev/null || true
  sudo docker rm 15-puzzle 2>/dev/null || true
  sudo docker run -d \
    --name 15-puzzle \
    --restart unless-stopped \
    -p 9501:3000 \
    15-puzzle:latest

  log "=== Deploy complete ==="
} 2>&1 | tee -a "$LOG_FILE"