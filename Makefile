NUXT_DIR     := src/nuxt
IONIC_DIR    := src/ionic
PROD_COMPOSE := etc/configs/production/docker-compose.yml
DEV_COMPOSE  := etc/configs/development/docker-compose.yml

.PHONY: install dev build up down logs deploy \
        ionic-install ionic-dev \
        dev-docker-up dev-docker-down dev-docker-logs \
        ionic-docker-up ionic-docker-down ionic-docker-logs

## ── Local Development ────────────────────────────────────────────────────────

install:
	cd $(NUXT_DIR) && pnpm install

dev:
	cd $(NUXT_DIR) && pnpm dev

ionic-install:
	cd $(IONIC_DIR) && npm install

ionic-dev:
	cd $(IONIC_DIR) && npm run dev

## ── Production Docker ────────────────────────────────────────────────────────

build:
	docker compose -f $(PROD_COMPOSE) build

up:
	docker compose -f $(PROD_COMPOSE) up -d

down:
	docker compose -f $(PROD_COMPOSE) down

logs:
	docker logs 15-puzzle --follow

deploy:
	docker compose -f $(PROD_COMPOSE) build
	docker compose -f $(PROD_COMPOSE) up -d --force-recreate

## ── Development Docker ───────────────────────────────────────────────────────

dev-docker-up:
	docker compose -f $(DEV_COMPOSE) up -d 15-puzzle-dev

dev-docker-down:
	docker compose -f $(DEV_COMPOSE) down

dev-docker-logs:
	docker logs 15-puzzle-dev --follow

ionic-docker-up:
	docker compose -f $(DEV_COMPOSE) up -d ionic-dev

ionic-docker-down:
	docker compose -f $(DEV_COMPOSE) stop ionic-dev

ionic-docker-logs:
	docker logs ionic-15-puzzle-dev --follow
