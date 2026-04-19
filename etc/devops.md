# DevOps Guide — 15 Puzzle

## Architecture

```
git push to main
    └── GitHub Webhook (push event)
            └── n8n Webhook Trigger (on ZimaOS)
                    └── IF: ref == refs/heads/main
                            └── SSH node → ZimaOS host:
                                  git pull origin main
                                  make deploy
                                      ↑
                                  Nginx (ZimaOS) → reverse proxy → :3000
```

No Docker Hub, no GitHub Actions. The NAS builds the image directly from the source.

---

## Repo Structure

```
etc/configs/production/     ← Production Docker files
etc/configs/development/    ← Development Docker files (hot reload)
src/nuxt/                   ← Nuxt 3 PWA source
src/ionic/                  ← Ionic/Capacitor mobile app source
Makefile                    ← All build and run commands (run from repo root)
```

---

## Makefile Reference

All commands are run from the **repo root**.

| Command | Description |
|---|---|
| `make install` | Install Nuxt dependencies |
| `make dev` | Run Nuxt dev server locally (`http://localhost:3000`) |
| `make build` | Build production Docker image |
| `make up` | Start production container |
| `make down` | Stop production container |
| `make logs` | Tail production container logs |
| `make deploy` | Build + restart production container (used by n8n) |
| `make ionic-install` | Install Ionic dependencies |
| `make ionic-dev` | Run Ionic dev server locally (`http://localhost:5173`) |
| `make dev-docker-up` | Start Nuxt dev container (hot reload) |
| `make dev-docker-down` | Stop dev containers |
| `make dev-docker-logs` | Tail Nuxt dev container logs |
| `make ionic-docker-up` | Start Ionic dev container |
| `make ionic-docker-down` | Stop Ionic dev container |
| `make ionic-docker-logs` | Tail Ionic dev container logs |

---

## Local Development

```bash
make install    # Install Nuxt deps (first time)
make dev        # http://localhost:3000

make ionic-install    # Install Ionic deps (first time)
make ionic-dev        # http://localhost:5173
```

---

## Docker Development (Hot Reload)

Run either or both dev servers in Docker with source mounted as a volume:

```bash
make dev-docker-up          # Nuxt dev container → http://localhost:3000
make ionic-docker-up        # Ionic dev container → http://localhost:5173

make dev-docker-logs        # Watch Nuxt logs
make ionic-docker-logs      # Watch Ionic logs

make dev-docker-down        # Stop all dev containers
```

---

## Build and Run Production Locally

```bash
make build      # Build the production Docker image
make up         # Start the container (http://localhost:3000)
make logs       # Tail logs
make down       # Stop the container
```

---

## ZimaOS: One-Time Setup

SSH into the ZimaOS server and run these steps once:

### 1. Install prerequisites

```bash
sudo apt update && sudo apt install -y git make
# Docker should already be installed on ZimaOS — verify:
docker --version
```

### 2. Clone the repo

```bash
mkdir -p ~/apps
git clone https://github.com/tubstrr/15-puzzle.git ~/apps/15-puzzle
cd ~/apps/15-puzzle
```

### 3. Make the deploy script executable

```bash
chmod +x ~/apps/15-puzzle/etc/scripts/deploy.sh
```

### 4. First build and start

```bash
make build
make up
```

The container restarts automatically on server reboot (`restart: unless-stopped`).

### 5. Verify it's running

```bash
curl http://localhost:3000
docker ps
```

---

## Deploy Script

The repo ships a deploy script at `etc/scripts/deploy.sh`. n8n calls this single path — no shell logic in the n8n node itself.

What the script does:
1. `cd ~/apps/15-puzzle`
2. `git pull origin main`
3. `make deploy` (rebuild image + restart container)
4. Appends timestamped output to `~/apps/15-puzzle/deploy.log`

To run manually:
```bash
bash ~/apps/15-puzzle/etc/scripts/deploy.sh
```

To watch the log:
```bash
tail -f ~/apps/15-puzzle/deploy.log
```

---

## n8n: SSH Key Setup

n8n needs an SSH credential to connect to ZimaOS. Set this up once:

### On your local machine (or wherever you manage keys)

```bash
ssh-keygen -t ed25519 -C "n8n-deploy" -f ~/.ssh/n8n_deploy
# No passphrase — n8n can't enter one interactively
```

### On ZimaOS

```bash
cat >> ~/.ssh/authorized_keys << 'EOF'
<paste the contents of ~/.ssh/n8n_deploy.pub here>
EOF
chmod 600 ~/.ssh/authorized_keys
```

### In n8n — add the credential

1. Go to **Credentials → New → SSH**
2. Fill in:
   - **Host**: ZimaOS IP (e.g. `192.168.1.x`)
   - **Port**: `22`
   - **Username**: your ZimaOS username
   - **Authentication**: Private Key
   - **Private Key**: paste the contents of `~/.ssh/n8n_deploy` (the private key)
3. Save as `ZimaOS SSH`

---

## n8n Workflow Setup

Create a new workflow in n8n with three nodes:

### Node 1 — Webhook (Trigger)
- **Type**: Webhook
- **HTTP Method**: POST
- **Authentication**: None (or Header Auth with a shared secret for security)
- Copy the **Production URL** once the workflow is active

### Node 2 — IF (branch filter)
- **Condition**: `{{ $json.body.ref }}` **equals** `refs/heads/main`
- **True** branch continues; **False** branch stops

### Node 3 — SSH
- **Credential**: `ZimaOS SSH` (created above)
- **Command**:
  ```bash
  bash ~/apps/15-puzzle/etc/scripts/deploy.sh
  ```

Activate the workflow and copy the production webhook URL for the next step.

---

## GitHub Webhook Setup

In the GitHub repo: **Settings → Webhooks → Add webhook**

| Field | Value |
|---|---|
| Payload URL | Your n8n production webhook URL |
| Content type | `application/json` |
| Events | Just the **push** event |
| Secret | Optional — add one and validate it in the n8n Webhook node |

---

## Nginx Reverse Proxy (ZimaOS)

Add a site config (e.g. `/etc/nginx/sites-available/15-puzzle`):

```nginx
server {
    listen 80;
    server_name your-domain-or-ip;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it and reload:
```bash
ln -s /etc/nginx/sites-available/15-puzzle /etc/nginx/sites-enabled/
nginx -t && nginx -s reload
```

---

## How a Deploy Works (End-to-End)

1. You push a commit to `main`
2. GitHub sends a POST to the n8n webhook URL
3. n8n filters to confirm it's a `main` branch push
4. n8n SSHes into ZimaOS and runs `git pull origin main && make deploy`
5. `make deploy` rebuilds the Docker image from the updated source and restarts the container
6. The updated app is live at your Nginx URL

Total time from push to live: ~2–4 minutes (dominated by the Docker build).

---

## Manual Redeploy

SSH into ZimaOS and run:

```bash
cd ~/apps/15-puzzle
git pull origin main
make deploy
```

---

## Troubleshooting

**Check container status and logs:**
```bash
make logs                        # follow production logs
docker ps                        # confirm container is running
docker logs 15-puzzle            # dump all logs
```

**Container not starting:**
```bash
docker compose -f etc/configs/production/docker-compose.yml up   # foreground, shows errors immediately
```

**n8n workflow not triggering:**
- Check n8n → Executions tab for recent runs and errors
- Verify the GitHub webhook delivered (GitHub → Settings → Webhooks → Recent Deliveries)
- Confirm the n8n workflow is **Active**

**Build fails on ZimaOS:**
```bash
cd ~/apps/15-puzzle
make build   # run manually to see full error output
```
Check that `pnpm-lock.yaml` is committed and matches `src/nuxt/package.json`.

**App unreachable after deploy:**
```bash
make logs              # check for startup errors
curl http://localhost:3000
nginx -t && nginx -s reload
```
