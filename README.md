# Nextra (Next.js + C++ Extra)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![C++20](https://img.shields.io/badge/C%2B%2B-20-00599C?logo=cplusplus)](https://isocpp.org/)
[![Drogon](https://img.shields.io/badge/Drogon-1.9.8-blue)](https://github.com/drogonframework/drogon)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack gamified web application with AI chat integration. The
frontend is built with Next.js 16, TypeScript, MUI, and Redux Toolkit.
The backend is a high-performance C++ Drogon API server compiled to a
native binary. The codebase is organized as a **domain-sliced monorepo**:
every feature lives under `services/<domain>/` with its own C++ service
code, controllers, SQL migrations, tests, and optional operator UI.

This repository is a GitHub **template**. Every file is a feature that
downstream consumers inherit — the defaults are designed to be extended
and corrected, not stripped.

## Quick Start

```bash
git clone https://github.com/your-org/nextra.git
cd nextra
docker compose up --build
```

Open **http://localhost:8889** for the portal, or
**http://localhost:8889/app/en** for the main app.

See [Dev Credentials](#dev-credentials) below.

## Architecture

```
                       HTTPS
  Browser ──────────────────────────────► Nginx Portal  :8889
                                              │
              ┌───────────────────────────────┤
              │  /app                         │  /api
              ▼                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│   Next.js 16         │       │   Drogon C++ API     │
│   (TypeScript)       │       │   (native binary)    │
│   MUI + Redux + RTK  │       │   REST / JSON        │
│   port 3100          │       │   port 8080          │
└──────────────────────┘       └──────────┬───────────┘
                                          │
                    ┌─────────────────────┼───────────────┐
                    │                     │               │
           ┌────────▼──┐      ┌───────────▼──┐  ┌────────▼────┐
           │PostgreSQL │      │Elasticsearch │  │Redis / Kafka│
           │port 5432  │      │port 9200     │  │             │
           └───────────┘      └──────────────┘  └─────────────┘
```

All backend and frontend domain code lives under `services/`. See
[docs/domain-layout.md](docs/domain-layout.md) for the canonical
subfolder reference and [docs/domains.md](docs/domains.md) for
the full domain table (55+ domains).

## Monorepo Layout

```
services/
  auth/             backend/ controllers/ migrations/ tests/
  users/            backend/ controllers/ migrations/
  blog/             backend/ controllers/ migrations/ tests/ admin/
  wiki/             backend/ controllers/ migrations/ tests/ admin/
  job-queue/        backend/ controllers/ migrations/ admin/
  cron/             backend/ controllers/ admin/
  notifications/    backend/ controllers/ migrations/ tests/ admin/
  ...               (50+ more feature domains)
  drogon-host/      Drogon shell: main.cpp, serve, config, Dockerfile
  http-filters/     JWT / CORS / rate-limit Drogon filters
  orm-models/       Drogon ORM generated models
  infra/            Kafka / Redis client shims
  manager-cli/      C++ project automation CLI
  migration-runner/ Topo-sorted per-domain SQL migrator
frontend/           Next.js 16 main app (all locales)
shared/             M3 component library, SCSS tokens, e2e runner
docker/             Nginx portal config, pre-baked dep images
docs/               Architecture, domain layout, guides
```

## Backend Daemons

All daemons are subcommands of the same `nextra-api` binary:

| CLI subcommand  | Compose service | Domain source          | Purpose                  |
|-----------------|-----------------|------------------------|--------------------------|
| `serve`         | `backend`       | `services/drogon-host` | Main REST API :8080      |
| `job-scheduler` | `job-scheduler` | `services/job-queue`   | Background worker pool   |
| `cron-manager`  | `cron-manager`  | `services/cron`        | Enqueues scheduled_jobs  |
| `migrate`       | (one-shot)      | `services/migration-runner` | Apply SQL migrations |
| `seed`          | (one-shot)      | `services/users`       | Seed demo data           |
| `create-admin`  | (one-shot)      | `services/drogon-host` | Bootstrap first admin    |

See [docs/services.md](docs/services.md) for full per-daemon
reference (env vars, config files, controller surface).

## Operator Tools (Next.js)

Each tool is a Next.js app under `services/<domain>/admin/` (or
`services/<domain>/public/`), reverse-proxied by nginx:

| Domain          | Nginx path      | SSO gated | Purpose                   |
|-----------------|-----------------|-----------|---------------------------|
| `sso`           | `/sso`          | no        | Login / logout            |
| `email`         | `/emailclient`  | yes       | Real webmail (IMAP+SMTP)  |
| `alerts`        | `/alerts`       | yes       | Operator alert centre     |
| `job-queue`     | `/jobs`         | yes       | job-scheduler dashboard   |
| `cron`          | `/cron`         | yes       | cron-manager dashboard    |
| `package-repository` | `/repo`   | yes       | Package repo browser      |
| `object-store`  | `/s3`           | yes       | S3 object store browser   |
| `database`      | `/db`           | yes       | Postgres admin UI         |

See [docs/domains.md](docs/domains.md) for all domains.

---

## Prerequisites

| Tool                | Version                |
|---------------------|------------------------|
| Node.js             | 22+                    |
| C++20 compiler      | GCC 13+ or Clang 17+  |
| Conan               | 2.x                    |
| CMake               | 3.20+                  |
| Docker & Compose    | Latest                 |
| PostgreSQL          | 16                     |
| Elasticsearch       | 8.x                    |

---

## Quick Start (Docker Compose)

The fastest way to run the entire stack:

```bash
# Clone the repository
git clone https://github.com/your-org/nextra.git
cd nextra

# Copy environment files
cp services/drogon-host/.env.example services/drogon-host/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your secrets (JWT key, DB password, API keys)

# Start all services
docker compose up --build
```

This starts PostgreSQL on port 5432, Elasticsearch on 9200, the
mailserver (Postfix + Dovecot) on 25/143/587, the C++ `backend`
API on port 8080, the `job-scheduler` and `cron-manager` daemons,
the Next.js frontend on port 3100, every operator tool listed
above, and finally the Nginx portal on port **8889**.

Open **http://localhost:8889** for the portal homepage,
or **http://localhost:8889/app/en** for the main app.

> The `docker-compose.yml` header comment still mentions
> `:8000` for historical reasons — the portal actually listens
> on `:8889`. Use 8889.

### Dev Credentials

| Role      | Username   | Email                  | Password   |
|-----------|------------|------------------------|------------|
| Admin     | devadmin   | dev.admin@nextra.local | DevAdmin1  |
| Moderator | devmod     | dev.mod@nextra.local   | DevMod1a   |
| User      | devuser    | dev.user@nextra.local  | DevUser1   |

User definitions live in `services/users/seeds/users.json`.
The `./manager` CLI can regenerate seed SQL or reset passwords:

```bash
# Generate SQL for all seed users (hashes passwords via PBKDF2-SHA256)
./manager user seed                          # stdout
./manager user seed --output users.sql       # to file

# Apply to the running database
./manager user seed | docker compose exec -T db \
  psql -U nextra -d nextra_db

# Reset a single user's password
./manager user reset --user devadmin --password NewPass1
./manager user reset --user dev.admin@nextra.local --password NewPass1
```

**Never use these credentials in production.**

To run in detached mode:

```bash
docker compose up --build -d
docker compose logs -f          # follow logs
docker compose down             # stop everything
```

For offline / air-gapped environments, preload all dependencies first:

```bash
./manager preload all        # cache Conan, npm, pip, Docker, apt
./manager docker build offline
```

---

## Manual Setup

### Backend (C++ Drogon)

```bash
cd services/drogon-host

# Install dependencies via Conan 2 (uses conanfile.py)
conan install . --build=missing --output-folder=build

# Configure and build from repo root
cd ../..
cmake -B build -DCMAKE_TOOLCHAIN_FILE=services/drogon-host/build/conan_toolchain.cmake \
      -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)

# Run database migrations
./build/nextra-api migrate --up

# Seed initial data (optional)
./build/nextra-api seed

# Start the server
./build/nextra-api serve --port 8080
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm ci

# Start the dev server
npm run dev
```

Open http://localhost:8889/app/en (via Nginx) or http://localhost:3100
directly. The frontend proxies API calls to `http://localhost:8080` by
default (configurable via `NEXT_PUBLIC_API_URL`).

### Database

Create a PostgreSQL 16 database:

```sql
CREATE DATABASE nextra_db;
CREATE USER nextra WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nextra_db TO nextra;
```

Set the connection string in `services/drogon-host/.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nextra_db
DB_USER=nextra
DB_PASSWORD=your_password
```

---

## Project Structure

```
nextra/
├── README.md                    # This file
├── CLAUDE.md                    # AI coding assistant instructions
├── docker-compose.yml           # Service orchestration
├── CMakeLists.txt               # Top-level CMake (explicit file lists)
├── services/
│   ├── drogon-host/             # Drogon shell (main.cpp, serve, config)
│   │   ├── backend/main.cpp     # CLI entry point (CLI11)
│   │   ├── config/config.json   # Drogon listener + DB pool + log level
│   │   ├── conanfile.py         # C++ dependencies (Conan 2)
│   │   └── Dockerfile
│   ├── http-filters/backend/    # JWT / CORS / rate-limit filters
│   ├── orm-models/              # Drogon ORM generated models
│   ├── infra/backend/           # Kafka / Redis client shims
│   ├── manager-cli/             # C++ project automation CLI
│   ├── migration-runner/        # Topo-sorted per-domain migrator
│   ├── migration-graph.json     # DAG of cross-domain FK deps
│   ├── auth/                    # backend/ controllers/ migrations/ tests/
│   ├── users/                   # backend/ controllers/ migrations/
│   ├── blog/                    # backend/ controllers/ migrations/ admin/
│   ├── wiki/                    # backend/ controllers/ migrations/ admin/
│   ├── job-queue/               # backend/ controllers/ migrations/ admin/
│   ├── cron/                    # backend/ controllers/ admin/
│   ├── notifications/           # backend/ controllers/ migrations/ admin/
│   └── ...                      # 40+ more feature domains
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # atoms / molecules / organisms
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Redux Toolkit + RTK Query
│   │   ├── messages/            # i18n translation JSON files
│   │   └── styles/globals.scss  # Authoritative global CSS
│   └── public/                  # Static assets
├── shared/
│   ├── components/m3/           # M3 component library
│   ├── scss/                    # M3 SCSS tokens
│   └── e2e/                     # Playwright JSON runner
├── docker/
│   ├── nginx/                   # Portal nginx config + location blocks
│   └── mail/                    # Dovecot / Postfix config
└── docs/
    ├── domain-layout.md         # Canonical subfolder reference
    ├── domains.md               # Table of all 55+ domains
    ├── migration-dag.md         # Per-domain migration guide
    ├── architecture.md          # System diagrams + data flows
    ├── services.md              # Drogon daemon catalogue
    ├── cron.md                  # Vixie cron dialect + seed flow
    ├── jobs.md                  # job_queue tables + REST endpoints
    ├── adding-a-daemon.md       # Walkthrough: new backend daemon
    └── adding-a-tool.md         # Walkthrough: new frontend tool
```

---

## Development Workflow

### Using the Manager Tool

All development tasks are driven through the C++ manager CLI (no shell
scripts or Python):

```bash
# Build the manager tool
# On Linux/macOS:
cd services/manager-cli && make

# On Windows (MSYS2 has no compiler — use Docker):
docker run --rm \
  --volume "//d/GitHub/next_extra_primary://src" \
  -w //src/services/manager-cli \
  gcc:13 bash -c "apt-get install -y libssl-dev -q && make"
```

```bash
# Core workflow
./manager build --debug          # Build backend
./manager quick-build            # Fast incremental build
./manager test                   # Run tests
./manager run --port 8080        # Build and run
./manager lint                   # Check formatting
./manager fmt                    # Auto-format code
./manager generate cmake         # Regenerate CMakeLists.txt
./manager generate models        # Regenerate Drogon ORM models
./manager migrate --up           # Run migrations
./manager seed                   # Seed database

# User management
./manager user seed              # Hash passwords, emit INSERT SQL
./manager user seed --output u.sql
./manager user reset --user devadmin --password NewPass1

# Docker orchestration
./manager docker up              # Docker Compose up
./manager docker down            # Stop services
./manager docker logs            # Follow logs
./manager docker status          # Check service status
./manager docker build           # Build images
./manager docker build offline   # Build for air-gapped env

# Ancillary services
./manager s3 up / down / logs    # S3-compatible store
./manager repo up / down / logs  # Package repository

# Offline / preloading
./manager preload all            # Cache all dependencies
./manager offline deps           # Package for offline use
./manager info                   # Show project info
```

### Frontend Development

```bash
cd frontend
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
```

### Adding New Source Files

After adding `.cpp` or `.h` files to the backend, regenerate the CMake
configuration:

```bash
./manager generate cmake
```

This re-globs source files from disk and writes explicit file lists into
`CMakeLists.txt` (avoids CMake `GLOB_RECURSE` pitfalls).

---

## API Overview

The backend exposes a RESTful JSON API on port 8080. All endpoints are
prefixed with `/api`.

| Group          | Base Path              | Description               |
|----------------|------------------------|---------------------------|
| Auth           | `/api/auth`            | Register, login, tokens   |
| Password       | `/api/auth/password`   | Forgot / reset password   |
| Users          | `/api/users`           | User profiles and stats   |
| Gamification   | `/api/gamification`    | Badges, points, streaks   |
| Notifications  | `/api/notifications`   | User notification inbox   |
| Chat           | `/api/chat`            | AI chat (Claude/OpenAI)   |
| Contact        | `/api/contact`         | Contact form submissions  |
| Dashboard      | `/api/dashboard`       | Dashboard stats overview  |
| Docs           | `/api/docs`            | Documentation / OpenAPI   |
| Search         | `/api/search`          | Full-text search (ES)     |
| Features       | `/api/features`        | Feature toggle management |
| Health         | `/api/health`          | Service health check      |

For the full endpoint reference with request/response schemas, see
[docs/api.md](docs/api.md).

The job-scheduler and cron-manager controllers add another
endpoint group:

| Group          | Base Path       | Description                       |
|----------------|-----------------|-----------------------------------|
| Jobs           | `/api/jobs`     | Queue, runs, dead-letter, enqueue |
| Cron           | `/api/cron`     | `scheduled_jobs` CRUD + force-tick |

See [docs/jobs.md](docs/jobs.md) and [docs/cron.md](docs/cron.md).

---

## Further Documentation

| File                                     | What it covers                        |
|------------------------------------------|---------------------------------------|
| [docs/domain-layout.md](docs/domain-layout.md) | Canonical subfolder reference   |
| [docs/domains.md](docs/domains.md)       | Table of all 55+ domains              |
| [docs/migration-dag.md](docs/migration-dag.md) | Per-domain migrations + DAG     |
| [docs/architecture.md](docs/architecture.md) | System diagrams + data flows      |
| [docs/services.md](docs/services.md)     | Every Drogon daemon                   |
| [docs/cron.md](docs/cron.md)             | Vixie dialect + scheduled_jobs        |
| [docs/jobs.md](docs/jobs.md)             | job_queue tables + REST API           |
| [docs/adding-a-daemon.md](docs/adding-a-daemon.md) | Walkthrough: new daemon       |
| [docs/adding-a-tool.md](docs/adding-a-tool.md) | Walkthrough: new frontend tool   |
| [docs/api.md](docs/api.md)               | REST endpoint reference               |
| [docs/deployment.md](docs/deployment.md) | CapRover deployment guide             |

---

## Deployment

The application is designed for deployment on CapRover as two separate
apps (frontend and backend). See [docs/deployment.md](docs/deployment.md)
for the complete step-by-step guide including SSL setup, environment
variables, and CI/CD with GitHub Actions.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Follow the coding conventions described in [CLAUDE.md](CLAUDE.md).
4. Write tests for new functionality.
5. Ensure linting passes: `./manager lint` and `cd frontend && npm run lint`.
6. Commit with a descriptive message.
7. Open a pull request against `main`.

### Code Style

- **C++**: 80-column limit, Linux brace style, 4-space indent, C++20
  features encouraged. See `.clang-format`.
- **TypeScript**: 80-column limit, single quotes, trailing commas,
  strict mode. See `frontend/.prettierrc`.
- **Components**: Atomic design (atoms < 100 LOC, molecules, organisms).
- **Constants**: Stored in JSON files, never hardcoded.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE)
for details.
