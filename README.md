# Nextra (Next.js + C++ Extra)

[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![C++20](https://img.shields.io/badge/C%2B%2B-20-00599C?logo=cplusplus)](https://isocpp.org/)
[![Drogon](https://img.shields.io/badge/Drogon-1.9-blue)](https://github.com/drogonframework/drogon)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack gamified web application with AI chat integration. The frontend
is built with Next.js, TypeScript, MUI, and Redux Toolkit. The backend is a
high-performance C++ Drogon API server compiled to a native binary. Features
include authentication, a points-and-badges gamification system, real-time
notifications, AI chat (Claude and OpenAI), internationalization, and dark
mode support.

---

## Architecture

```
                       HTTPS
  Browser ──────────────────────────────► Reverse Proxy
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
                                 ┌────────▼─────────┐
                                 │  PostgreSQL 16    │
                                 │  port 5432        │
                                 └──────────────────┘
```

The frontend communicates with the backend over REST/JSON. The backend
handles all business logic, authentication, gamification scoring,
notification dispatch, and proxied AI chat requests to Claude and OpenAI
APIs. PostgreSQL stores all persistent data.

---

## Prerequisites

| Tool                | Version     |
|---------------------|-------------|
| Node.js             | 22+         |
| C++20 compiler      | GCC 13+ or Clang 17+ |
| Conan               | 2.x         |
| CMake               | 3.20+       |
| Docker & Compose    | Latest      |
| PostgreSQL           | 16          |

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

To run in detached mode:

```bash
docker compose up --build -d
docker compose logs -f          # follow logs
docker compose down             # stop everything
```

For development with hot reload and volume mounts:

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## Manual Setup

### Backend (C++ Drogon)

```bash
cd backend

# Install dependencies via Conan 2
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
├── docker-compose.yml          # Production compose
├── docker-compose.dev.yml      # Development compose
├── .clang-format               # C++ formatting rules
├── .clang-tidy                 # C++ linting rules
├── backend/
│   ├── CMakeLists.txt
│   ├── Dockerfile
│   ├── captain-definition      # CapRover deploy config
│   ├── conanfile.txt           # C++ dependencies (Conan 2)
│   ├── config/                 # Drogon server configuration
│   ├── migrations/             # SQL migration files
│   ├── seed/                   # JSON seed data
│   ├── src/
│   │   ├── main.cpp            # CLI entry point (CLI11)
│   │   ├── controllers/        # HTTP route handlers
│   │   ├── filters/            # Auth, CORS, rate-limit
│   │   ├── models/             # Drogon ORM models
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # JWT, hashing, validators
│   │   └── constants/          # JSON config files
│   └── tests/                  # GTest unit tests
├── frontend/
│   ├── Dockerfile
│   ├── captain-definition      # CapRover deploy config
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
├── tools/
│   ├── cmake-gen/              # CMakeLists.txt generator
│   └── manager/                # Dev workflow CLI tool
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

# Now use the manager
./manager build --debug          # Build backend
./manager test                   # Run tests
./manager run --port 8080        # Build and run
./manager lint                   # Check formatting
./manager fmt                    # Auto-format code
./manager generate cmake         # Regenerate CMakeLists.txt
./manager migrate --up           # Run migrations
./manager docker up              # Docker Compose up
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
| Users          | `/api/users`           | User profiles and stats   |
| Gamification   | `/api/gamification`    | Badges, points, streaks   |
| Notifications  | `/api/notifications`   | User notification inbox   |
| Chat           | `/api/chat`            | AI chat (Claude/OpenAI)   |
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
