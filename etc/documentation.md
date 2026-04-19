# Architecture Documentation — 15 Puzzle

## Current Deployment Architecture

```
git push to main
    └── GitHub Webhook → n8n (ZimaOS)
            └── IF ref == refs/heads/main
                    └── SSH → ZimaOS host:
                          git pull origin main
                          make deploy
                              ↑
                          Nginx → reverse proxy → :3000
```

**Key characteristics:**
- Builds happen **on the NAS** from source — no external registry required
- n8n receives the GitHub push webhook and triggers deployment over SSH
- `make deploy` rebuilds the Docker image locally and restarts the container
- No Docker Hub, no GitHub Actions, no external build infrastructure

---

## Why This Architecture

The build-on-NAS approach was chosen over a CI/CD-built + registry-pull model for these reasons:

1. **Fewer services to maintain** — no registry, no Traefik, no Watchtower to run alongside the app
2. **No external dependencies** — the entire pipeline lives on one server
3. **n8n is already running** — using it as the webhook receiver costs nothing extra
4. **Single app** — the overhead of a self-hosted registry only pays off with multiple apps sharing it

The tradeoff is that the NAS does the build work. If ZimaOS hardware proves too slow for `pnpm build` inside Docker, moving builds off-server becomes the natural next step.

---

## The Alternative: Self-Hosted Registry + Watchtower

There's a cleaner architecture worth considering if requirements change. The idea (from [Thomas Bandt's article](https://thomasbandt.com)) replaces the current build-on-NAS approach with:

```
git push → GitHub Actions
                ├── docker build
                ├── docker push → self-hosted registry (on ZimaOS)
                └── curl POST → Watchtower HTTP API
                                    └── Watchtower pulls new image
                                        and restarts container
```

### When this makes sense
- NAS is too slow to build images (CPU/RAM constrained)
- Multiple apps sharing one internal registry — the fixed cost of running it gets amortized
- You want to decouple build environment from deployment environment

### When it doesn't
- Single app, as is the case now — extra services for no meaningful gain
- NAS build times are acceptable

### Key components

**Self-hosted registry** — Docker's official `registry:2` image. Stores images on disk, speaks the Docker Registry HTTP API v2. Requires:
- htpasswd for authentication
- TLS termination (Traefik with Let's Encrypt, or similar)
- Manual retention/garbage collection (no built-in cleanup policy)

**Watchtower** — A container that monitors other running containers and updates them when a newer image is available in the registry. Can be triggered on-demand via HTTP API rather than relying solely on polling.

```yaml
services:
  watchtower:
    image: containrrr/watchtower
    restart: always
    environment:
      - WATCHTOWER_HTTP_API_TOKEN=${WATCHTOWER_TOKEN}
      - WATCHTOWER_HTTP_API_UPDATE=true
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_POLL_INTERVAL=86400   # fallback; we trigger explicitly
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /home/user/.docker/config.json:/config.json
```

Deploying becomes a single HTTP call from any CI/CD pipeline:
```bash
curl -f -X POST "https://deploy.example.com/v1/update" \
  -H "Authorization: Bearer $WATCHTOWER_TOKEN"
```

### Watchtower as a drop-in improvement

Even without the registry switch, Watchtower's HTTP API trigger is **a cleaner alternative to the current n8n SSH approach**. Instead of n8n needing SSH credentials and shell access into ZimaOS, n8n would just POST to Watchtower's endpoint. Fewer permissions, simpler n8n workflow.

If the current SSH setup ever becomes a pain point (key rotation, permission issues), Watchtower is the path of least resistance.

---

## Gotchas Worth Remembering

**Self-hosted registry has no retention policy.** Every image pushed stays on disk forever. Cleanup requires:
1. DELETE the manifest via the Registry HTTP API
2. Run garbage collection to reclaim the underlying layer blobs:
   ```bash
   docker exec registry bin/registry garbage-collect \
     /etc/docker/registry/config.yml --delete-untagged
   ```
   Set `REGISTRY_STORAGE_DELETE_ENABLED=true` or delete requests will be rejected.

**Watchtower reads credentials from `/config.json` inside the container** — not `~/.docker/config.json`, not `/root/.docker/config.json`. Mount it exactly:
```yaml
volumes:
  - /home/user/.docker/config.json:/config.json
```
Failed auth logs at debug level only (`WATCHTOWER_DEBUG=true` to surface it).

**Watchtower needs `--force-recreate` to pick up config changes.** `docker restart` keeps the old environment variables and volumes. Always use `docker compose up -d --force-recreate` after changing Watchtower's own configuration.

**Always use `curl -f`** when triggering Watchtower from a pipeline. Without `-f`, a 401 from a mismatched token returns exit code 0 and the pipeline step appears to succeed.

---

## Decision Log

| Decision | Choice | Reason |
|---|---|---|
| Image registry | None (build on NAS) | Single app, simpler, no external dep |
| Deploy trigger | n8n webhook → SSH → `make deploy` | n8n already running; SSH is sufficient for one server |
| TLS/routing | Nginx reverse proxy | Already running on ZimaOS |
| Future: slow NAS builds | Self-hosted registry + GitHub Actions build | Move build load off NAS |
| Future: SSH friction | Watchtower HTTP API trigger | Cleaner than SSH, no shell credentials needed |
