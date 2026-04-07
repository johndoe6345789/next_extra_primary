# Nextra (Next.js + C++ Extra)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![C++20](https://img.shields.io/badge/C%2B%2B-20-00599C?logo=cplusplus)](https://isocpp.org/)
[![Drogon](https://img.shields.io/badge/Drogon-1.9.8-blue)](https://github.com/drogonframework/drogon)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack gamified web application with AI chat integration. The frontend
is built with Next.js, TypeScript, MUI, and Redux Toolkit. The backend is a
high-performance C++ Drogon API server compiled to a native binary. Features
include authentication, a points-and-badges gamification system, real-time
notifications, AI chat (Claude and OpenAI), full-text search via
Elasticsearch, feature toggles, contact forms, a documentation viewer,
internationalization, and dark mode support. The project also ships
ancillary tools: an email client, a PostgreSQL admin dashboard, a package
repository manager, and an S3-compatible object store for offline use.

---

## Architecture

```
                       HTTPS
  Browser ──────────────────────────────► Nginx Reverse Proxy
                                              │
                ┌─────────────────────────────┤
                │                             │
                ▼                             ▼
  ┌──────────────────────┐     ┌──────────────────────┐
  │   Next.js 16         │     │   Drogon C++ API     │
  │   (TypeScript)       │     │   (native binary)    │
  │   MUI + Redux + RTK  │     │   REST / JSON        │
  │   port 3000          │     │   port 8080          │
  └──────────────────────┘     └──────────┬───────────┘
                                          │
                              ┌───────────┼───────────┐
                              │           │           │
                     ┌────────▼──┐  ┌─────▼──────┐  ┌▼──────────┐
                     │PostgreSQL │  │Elasticsearch│  │Mail Server│
                     │port 5432  │  │port 9200    │  │(Dovecot)  │
                     └───────────┘  └────────────┘  └───────────┘
```

The frontend communicates with the backend over REST/JSON via an Nginx
reverse proxy. The backend handles all business logic, authentication,
gamification scoring, notification dispatch, full-text search indexing
(Elasticsearch), feature toggles, and proxied AI chat requests to Claude
and OpenAI APIs. PostgreSQL stores all persistent data. A bundled mail
server (Dovecot + Roundcube) provides email services.

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
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your secrets (JWT key, DB password, API keys)

# Start all services
docker compose up --build
```

This starts PostgreSQL on port 5432, the C++ API on port 8080, and the
Next.js frontend on port 3000. Open http://localhost:3000 in your browser.

### Default Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@nextra.local | Admin123!  |
| User  | user@nextra.local  | User123!   |

These accounts are created by the seed migration
(`backend/migrations/003_seed_data.sql`). Change them immediately in
any non-development environment.

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
cd backend

# Install dependencies via Conan 2 (uses conanfile.py)
conan install . --build=missing --output-folder=build

# Configure and build
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake \
         -DCMAKE_BUILD_TYPE=Release
cmake --build . -j$(nproc)

# Run database migrations
./nextra-api migrate --up

# Seed initial data (optional)
./nextra-api seed

# Start the server
./nextra-api serve --port 8080
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm ci

# Start the dev server
npm run dev
```

Open http://localhost:3000. The frontend proxies API calls to
`http://localhost:8080` by default (configurable via `NEXT_PUBLIC_API_URL`).

### Database

Create a PostgreSQL 16 database:

```sql
CREATE DATABASE nextra;
CREATE USER nextra_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nextra TO nextra_user;
```

Set the connection string in `backend/.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nextra
DB_USER=nextra_user
DB_PASSWORD=your_password
```

---

## Project Structure

```
nextra/
├── README.md                   # This file
├── CLAUDE.md                   # AI coding assistant instructions
├── agents.md                   # AI agent configurations
├── roadmap.md                  # Feature roadmap
├── plan.md                     # Implementation plan
├── docker-compose.yml          # Service orchestration
├── .clang-format               # C++ formatting rules
├── .clang-tidy                 # C++ linting rules
├── backend/
│   ├── CMakeLists.txt
│   ├── Dockerfile
│   ├── conanfile.py            # C++ dependencies (Conan 2)
│   ├── config/                 # Drogon server configuration
│   ├── migrations/             # SQL migration files
│   ├── seed/                   # JSON seed data
│   ├── seeds/                  # Extended seed data
│   ├── src/
│   │   ├── main.cpp            # CLI entry point (CLI11)
│   │   ├── commands/           # CLI subcommand handlers
│   │   ├── controllers/        # HTTP route handlers
│   │   ├── docs/               # OpenAPI spec definitions
│   │   ├── filters/            # Auth, CORS, rate-limit
│   │   ├── models/             # Drogon ORM models
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # JWT, hashing, validators
│   │   └── constants/          # JSON config files
│   └── tests/                  # GTest unit tests
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # atoms / molecules / organisms
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # Redux Toolkit + RTK Query
│   │   ├── theme/              # MUI theme + design tokens
│   │   ├── i18n/               # next-intl configuration
│   │   ├── messages/           # Translation JSON files
│   │   ├── constants/          # App constants (JSON)
│   │   ├── lib/                # Utility functions
│   │   ├── types/              # TypeScript type definitions
│   │   └── seed/               # Mock data for development
│   └── public/                 # Static assets
├── shared/
│   ├── components/             # Shared UI component library
│   ├── hooks/                  # Shared React hooks
│   ├── icons/                  # Material icons + symbols
│   ├── interfaces/             # Shared TypeScript interfaces
│   ├── redux/                  # Shared Redux slices + hooks
│   ├── schemas/                # JSON schemas + validation
│   ├── scss/                   # Shared SCSS styles
│   ├── storybook/              # Storybook configuration
│   └── e2e/                    # Playwright end-to-end tests
├── docker/
│   ├── backend-deps.Dockerfile # Pre-baked backend deps
│   ├── frontend-deps.Dockerfile# Pre-baked frontend deps
│   ├── mail/                   # Dovecot + Roundcube config
│   └── nginx/                  # Reverse proxy + portal
├── tools/
│   ├── manager/                # Dev workflow CLI (cmake-gen)
│   ├── emailclient/            # Email client application
│   ├── pgadmin/                # PostgreSQL admin dashboard
│   ├── packagerepo/            # Package repository manager
│   └── s3server/               # S3-compatible object store
└── docs/
    ├── api.md                  # Full API reference
    ├── deployment.md           # CapRover deployment guide
    └── architecture.md         # System architecture docs
```

---

## Development Workflow

### Using the Manager Tool

All development tasks are driven through the C++ manager CLI (no shell
scripts or Python):

```bash
cd tools/manager && mkdir build && cd build
conan install .. --build=missing
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake
cmake --build .

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
