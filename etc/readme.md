# etc/

Infrastructure and configuration files for the 15 Puzzle app.

## Structure

```
etc/
├── configs/
│   ├── development/        ← Docker setup for local dev with hot reload
│   │   ├── Dockerfile.dev          Nuxt dev container
│   │   ├── Dockerfile.ionic-dev    Ionic Vite dev container
│   │   └── docker-compose.yml      Both services + named volumes
│   └── production/         ← Production-ready Docker image
│       ├── Dockerfile              Multi-stage Nuxt build (builder + runner)
│       └── docker-compose.yml      Single production service
└── devops.md               ← Full deployment guide
```

## Usage

All commands are in the root [Makefile](../Makefile) — run them from the repo root, not from here.

- Dev containers: `make dev-docker-up`, `make ionic-docker-up`
- Production: `make build`, `make up`, `make deploy`

See [devops.md](devops.md) for the complete setup guide including ZimaOS, n8n, and Nginx configuration.
