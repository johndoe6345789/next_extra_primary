# Nextra Helm Chart

Deploy the full Nextra stack to a Kubernetes cluster.

## Quickstart

```bash
# Install with default values
helm install nextra ./deploy/helm/nextra

# Override the ingress host
helm install nextra ./deploy/helm/nextra \
  --set ingress.host=nextra.example.com

# Use a dedicated namespace
helm install nextra ./deploy/helm/nextra \
  --namespace nextra --create-namespace
```

## What gets deployed

Core services (always on unless explicitly disabled):

- `backend` — Drogon C++ API
- `frontend` — Next.js 16
- `job-scheduler` — Kafka-backed async jobs
- `cron-manager` — scheduled tasks
- `sso` — single sign-on
- `portal` — nginx reverse proxy
- `postgres`, `redis`, `kafka`, `elasticsearch` —
  StatefulSets with PersistentVolumeClaims

Ingress maps the following paths on `values.yaml:ingress.host`:

| Path   | Backend service |
|--------|-----------------|
| `/`    | portal          |
| `/app` | frontend        |
| `/api` | backend         |
| `/sso` | sso             |
| `/jobs`| job-scheduler   |
| `/cron`| cron-manager    |

## Optional add-on services

Services delivered by sibling agents (`audit`, `image`,
`pdf`, `flags`, `comments`, `search`, `notifications`,
`streaming`, `blog`, `ecommerce`, `wiki`, `backup`,
`video`, `webhooks`, `status`, `forum`) can be layered in
by setting their `enabled` flag under `optionalServices`
and adding sibling deployment templates. The main chart
deliberately omits their templates so that this branch
does not conflict with parallel feature work.

## Customising nginx

The portal uses an in-template default `nginx.conf`. To
use the repo's `docker/nginx/nginx.conf` verbatim, pass
it via `--set-file`:

```bash
helm install nextra ./deploy/helm/nextra \
  --set-file portal.nginxConf=docker/nginx/nginx.conf
```

## Uninstalling

```bash
helm uninstall nextra
kubectl delete pvc -l app.kubernetes.io/instance=nextra
```
