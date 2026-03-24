# Full-Stack Application: Next.js + C++ Drogon

## Context

Greenfield project scaffold for a production-quality full-stack application.
The repo currently contains only LICENSE, README.md, and a Java .gitignore
(needs replacing). The goal is a modern, accessible, gamified web app with
AI chat integration (Claude + OpenAI), backed by a high-performance C++
Drogon API server compiled to a native binary. No Python or shell scripts
anywhere -- all tooling is C++.

---

## Architecture Overview

```
┌─────────────────┐     REST/JSON     ┌──────────────────┐
│  Next.js 16     │ ◄──────────────►  │  Drogon C++ API  │
│  (TypeScript)   │    port 3000      │  (native binary)  │
│  MUI + Redux    │                   │  port 8080        │
└─────────────────┘                   └────────┬─────────┘
                                               │
                                      ┌────────▼─────────┐
                                      │  PostgreSQL 16    │
                                      │  port 5432        │
                                      └──────────────────┘
```

---

## Phase 0: Project Scaffold & Tooling

### 0.1 Replace `.gitignore`
Combined Node.js + C++ ignores (node_modules, .next, build/,
*.o, *.so, CMakeCache.txt, conan/, .env, .env.local, etc.)

### 0.2 C++ Dev Tools (all in `tools/`)

All project automation is C++ with CLI11. No Python, no bash.

#### A) CMakeLists.txt Generator (`tools/cmake-gen/`)
Reads `project.json` manifest, uses **inja** (C++ Jinja2) to
render `CMakeLists.txt`. Uses `std::filesystem::recursive_
directory_iterator` to glob source files at generation time
and embed them explicitly (no CMake GLOB_RECURSE).

**Files:**
- `tools/cmake-gen/main.cpp` -- CLI entry (CLI11)
- `tools/cmake-gen/project.json` -- project manifest
- `tools/cmake-gen/templates/root.cmake.j2` -- root template
- `tools/cmake-gen/templates/lib.cmake.j2` -- library template
- `tools/cmake-gen/conanfile.txt` -- Conan 2 deps for tool
- `tools/cmake-gen/CMakeLists.txt` -- builds the generator

#### B) Project Manager (`tools/manager/`)
A C++ CLI tool (CLI11) that wraps Docker, Conan, CMake, and
test commands. Single entry point for all dev/build/deploy ops.

**Commands:**
```
./manager build [--release|--debug]
./manager test [--filter <pattern>]
./manager run [--port 8080]
./manager docker build [--prod]
./manager docker up [--prod] [--detach]
./manager docker down
./manager docker logs [service]
./manager lint
./manager fmt
./manager generate cmake
./manager generate models
./manager migrate [--up|--down|--status]
./manager seed [--file <json>]
```

### 0.3 Conan 2 Setup
- `backend/conanfile.txt` for backend deps
- Conan 2 generators: `CMakeDeps` + `CMakeToolchain`

**Key Conan 2 dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| drogon | 1.9.12 | Web framework |
| nlohmann_json | 3.11.3 | JSON handling |
| cli11 | 2.4.2 | CLI argument parsing |
| jwt-cpp | 0.7.0 | JWT auth tokens |
| inja | 3.4.0 | Jinja2 templates in C++ |
| mailio | 0.23.0 | SMTP email sending |
| fmt | 10.2.1 | String formatting |
| spdlog | 1.14.1 | Logging |
| GTest | 1.15.2 | Unit testing |

### 0.4 Linting Configuration
- `.clang-format` -- 80 col, Linux brace style, 4-space indent
- `.clang-tidy` -- readability-*, modernize-*, performance-*
- `frontend/.eslintrc.json` + `frontend/.prettierrc`

### 0.5 Documentation Files
- `README.md`, `CLAUDE.md`, `agents.md`, `roadmap.md`, `plan.md`

---

## Phase 1: Backend Core (C++ Drogon)

### 1.1 Directory Structure
```
backend/
├── CMakeLists.txt
├── conanfile.txt
├── config/
│   ├── config.json
│   ├── config.prod.json
│   └── models/model.json
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_gamification.sql
│   └── 003_chat.sql
├── seed/
│   ├── users.json
│   ├── badges.json
│   └── sample_data.json
├── src/
│   ├── main.cpp
│   ├── controllers/
│   ├── filters/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── constants/
├── tests/
└── Dockerfile
```

### 1.2 CLI Entry Point (main.cpp)
Uses CLI11 for subcommands:
- `./nextra-api` -- start server (default)
- `./nextra-api serve --port 8080 --config config.json`
- `./nextra-api migrate --up`
- `./nextra-api migrate --down`
- `./nextra-api seed`
- `./nextra-api create-admin --email admin@example.com`
- `./nextra-api generate-models`

### 1.3 Database Schema
**users**: id (UUID PK), email, username, password_hash,
display_name, avatar_url, is_active, is_confirmed, role,
total_points, current_level, created_at, updated_at

**badges**: id, name, description, icon_url, category,
points_required, criteria_json (JSONB)

**user_badges**: id, user_id (FK), badge_id (FK), earned_at,
UNIQUE(user_id, badge_id)

**points_log**: id, user_id (FK), amount, reason, source,
created_at

**streaks**: id, user_id (FK UNIQUE), current_streak,
longest_streak, last_activity_date

**notifications**: id, user_id (FK), title, body, type,
is_read, metadata_json (JSONB), created_at

**chat_messages**: id, user_id (FK), role, content, provider,
model, tokens_used, created_at

**token_blocklist**: id, jti, token_type, created_at

### 1.4 REST API Endpoints

**Auth** (`/api/auth`):
POST /register, POST /login, POST /logout, POST /refresh,
POST /forgot-password, POST /reset-password/{token},
GET /confirm/{token}, GET /me

**Users** (`/api/users`):
GET /, GET /{id}, PATCH /{id}, GET /{id}/badges,
GET /{id}/stats

**Gamification** (`/api/gamification`):
GET /badges, GET /leaderboard, GET /streaks/me,
POST /points/award, GET /progress/me

**Notifications** (`/api/notifications`):
GET /, GET /unread-count, PATCH /{id}/read,
POST /mark-all-read, DELETE /{id}

**Chat** (`/api/chat`):
POST /messages, GET /history, DELETE /history

**Health** (`/api/health`):
GET / -- returns {"status": "ok"}

### 1.5 Services Layer
- **AuthService** -- register, login, token generation/refresh,
  password hashing, email confirmation tokens
- **EmailService** -- wraps mailio for SMTP, HTML templates
- **GamificationService** -- award points, check badge criteria,
  update streaks, compute levels
- **NotificationService** -- create notifications on events
- **AiService** -- HTTP client to Claude and OpenAI APIs
- **MigrationService** -- reads SQL files, tracks applied migrations

---

## Phase 2: Frontend Foundation (Next.js 16 + TypeScript)

### 2.1 Directory Structure
```
frontend/
├── package.json
├── tsconfig.json
├── next.config.ts
├── .env.example
├── proxy.ts
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── (auth)/
│   │       ├── (dashboard)/
│   │       └── (public)/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── providers/
│   ├── hooks/
│   ├── store/
│   ├── theme/
│   ├── i18n/
│   ├── messages/
│   ├── constants/
│   ├── lib/
│   ├── types/
│   └── seed/
└── Dockerfile
```

### 2.2 Key Patterns

**Provider Stack** (root layout.tsx):
StoreProvider > ThemeProvider > IntlProvider > AuthGate > children

**Redux Store Shape:**
```
RootState {
  auth: { user, accessToken, refreshToken, isAuthenticated }
  notifications: { items, unreadCount }
  theme: { mode: 'light' | 'dark' | 'system' }
  gamification: { points, level, badges, streak, leaderboard }
  chat: { messages, isStreaming, activeProvider }
  ui: { sidebarOpen, notificationPanelOpen, activeModal }
  [baseApi.reducerPath]: RTK Query cache
}
```

**Theme:** MUI `createTheme` with `colorSchemes` API. MD3 tokens
in `tokens.json`. `ThemeToggle` calls `setMode()`.

**i18n:** next-intl with `proxy.ts` (Next.js 16 convention).

**Accessibility:** Every interactive component gets data-testid,
aria-label, id, tabIndex, and keyboard event handlers.

---

## Phase 3: Auth & App Shell
- LoginForm / RegisterForm organisms
- useFormValidation hook with rules from validation.json
- authApi RTK Query mutations
- JWT stored in Redux, attached via baseApi prepareHeaders
- AuthGate provider redirects unauthenticated users
- Navbar, Footer, HeroSection, FeatureGrid organisms

---

## Phase 4: Gamification & Notifications
- Points: login (+10), chat (+5), badge (+50)
- Levels defined in gamification.json
- Badges: early adopter, streak master, chatterbox, etc.
- Streaks: daily login tracking
- Leaderboard: weekly/monthly/all-time
- Notification bell with unread count, slides-open panel

---

## Phase 5: AI Chat Integration
- AiService wraps Claude and OpenAI HTTP APIs
- Provider toggle in UI
- Chat history in DB, paginated retrieval
- ChatPanel with message list + input
- useAiChat hook manages streaming state

---

## Phase 6: DevOps & Docker
- Backend multi-stage Dockerfile (conan-build + slim runtime)
- Frontend multi-stage Dockerfile (deps + build + runner)
- Docker Compose (db, backend, frontend)
- CapRover captain-definition files
- docs/deployment.md with full instructions

---

## Phase 7: CMakeLists Generator Tool
- Reads project.json, globs source files from disk
- Renders inja templates to produce CMakeLists.txt
- Avoids CMake GLOB_RECURSE by writing explicit file lists
- Re-run after adding/removing source files

---

## Phase 8: Documentation & Polish
- JSDoc on all TypeScript exports
- Doxygen comments on all C++ public methods
- README.md, CLAUDE.md, agents.md, roadmap.md
- docs/api.md, docs/deployment.md, docs/architecture.md

---

## Implementation Order

| # | Phase | Files | Priority |
|---|-------|-------|----------|
| 0 | Scaffold + tooling + manager | ~35 | First |
| 1 | Backend core (C++) | ~40 | Second |
| 2 | Frontend foundation | ~35 | Third |
| 3 | Auth + app shell | ~20 | Fourth |
| 4 | Gamification + notif | ~15 | Fifth |
| 5 | AI chat | ~10 | Sixth |
| 6 | Docker + CapRover | ~8 | Seventh |
| 7 | CMake generator + templates | ~8 | Eighth |
| 8 | Docs + polish | ~10 | Last |

**Total: ~180+ files, zero Python, zero shell scripts**

---

## Verification Plan

1. Backend compiles: `conan install . && cmake --build .`
2. Backend starts: `./nextra-api serve` -- health endpoint OK
3. Frontend compiles: `npm run build` -- no TS/ESLint errors
4. Frontend starts: `npm run dev` -- hero page renders
5. Docker Compose: `docker compose up` -- all 3 services healthy
6. Auth flow: Register > confirm email > login > get JWT
7. Gamification: Login awards points, badge criteria checked
8. Chat: Send message to Claude API, receive response
9. Notifications: Badge earned triggers notification
10. Accessibility: Tab through all interactive elements
11. i18n: Switch locale, all strings translated
12. Dark mode: Toggle theme, all components respect it
13. Lint: `clang-format --dry-run` + `eslint` pass clean
14. CMake gen: Run tool, generated CMakeLists builds correctly

---

## Key Decisions

- **C++ over Python**: Native binary performance, single deployment
  artifact, no runtime dependencies
- **Conan 2 over vcpkg**: Better CMake integration via
  CMakeDeps/CMakeToolchain
- **inja over Python Jinja2**: Keep everything C++
- **CLI11 over custom argparse**: Feature-rich, header-only,
  supports subcommands
- **mailio over libcurl**: Purpose-built for SMTP/MIME
- **nlohmann/json over jsoncpp**: Stricter typing, better API
- **RTK Query over manual fetch**: Auto-caching, auto-refetch
- **MUI colorSchemes API**: No flash-of-wrong-theme, CSS vars
- **Atomic design**: atoms/molecules/organisms keeps components
  under 100 LOC

---

## Phase 2: GHCR Base Images + clang-tidy CI

### Context

CI builds are slow because every run installs Conan deps
(~3 min) and npm deps (~30s) from scratch. Fix: publish
pre-baked dependency images to GHCR, pull them in CI so
only source code gets compiled. Also re-enables clang-tidy
static analysis using the Conan-cached base image.

### Design Decisions

- **Pull + extract, not `container:`** — `container:` fails
  the job if image missing. Pull + docker cp allows graceful
  fallback to from-scratch installs.
- **clang-tidy advisory** — `continue-on-error: true`.
  Tighten to blocking once codebase is clean.
- **Tags**: `:latest` + `:sha-<hash>` of dep file.
- **No compile_commands.json in base image** — depends on
  source. CI generates it during cmake configure.

### New Files

| File | Purpose |
|------|---------|
| `docker/backend-deps.Dockerfile` | gcc:13 + cmake + conan + clang-tidy + deps |
| `docker/frontend-deps.Dockerfile` | node:22-alpine + npm ci |
| `.github/workflows/base-images.yml` | Build/push base images to GHCR |

### Modified Files

| File | Change |
|------|--------|
| `.github/workflows/ci.yml` | clang-tidy + pull+extract for all jobs |
| `backend/Dockerfile` | ARG DEPS_IMAGE for base image |
| `frontend/Dockerfile` | ARG DEPS_IMAGE + remove CDATA wrappers |

### CI Flow

```
base-images.yml (on dep change / weekly / manual)
  └── Builds backend-deps + frontend-deps → GHCR

ci.yml (on every PR / push)
  ├── lint-backend
  │     ├── clang-format (bare runner)
  │     └── clang-tidy (docker run with base image)
  ├── build-backend
  │     ├── docker pull → extract Conan cache
  │     └── conan install (instant) → cmake build
  ├── build-frontend
  │     ├── docker pull → extract node_modules
  │     └── npm install (instant) → next build
  └── test-* (same pull+extract pattern)
```