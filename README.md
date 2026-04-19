# 15 Puzzle

A classic sliding puzzle game built as a Progressive Web App (PWA) — installable on any device, playable offline.

Built by [Jon Knoll](https://github.com/tubstrr).

---

## Repo Structure

```
15-puzzle/
├── src/
│   ├── nuxt/       ← Nuxt 3 PWA (the web app)
│   └── ionic/      ← Ionic/Capacitor (the mobile app)
├── etc/
│   ├── configs/
│   │   ├── development/    ← Docker dev containers (hot reload)
│   │   └── production/     ← Docker production image
│   └── devops.md           ← Full deployment guide
├── Makefile        ← All build, run, and deploy commands
└── README.md
```

---

## Quick Start

```bash
make install    # Install Nuxt dependencies
make dev        # Start dev server → http://localhost:3000
```

---

## All Commands

| Command | Description |
|---|---|
| `make install` | Install Nuxt dependencies |
| `make dev` | Nuxt dev server (local) |
| `make build` | Build production Docker image |
| `make up` | Start production container |
| `make down` | Stop production container |
| `make logs` | Tail production logs |
| `make deploy` | Build + restart (used by auto-deploy) |
| `make ionic-install` | Install Ionic dependencies |
| `make ionic-dev` | Ionic dev server (local) |
| `make dev-docker-up` | Start Nuxt dev container |
| `make ionic-docker-up` | Start Ionic dev container |

---

## Deployment

The app self-hosts on a ZimaOS NAS with Nginx. Pushing to `main` triggers an automatic deploy via a GitHub webhook → n8n → SSH → `make deploy`.

See [etc/devops.md](etc/devops.md) for the full deployment guide.
