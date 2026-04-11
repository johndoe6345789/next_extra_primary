# CLAUDE.md - AI Assistant Instructions

This file provides context for AI coding assistants working on the Nextra
project. Read this before making any changes.

---

## Project Overview

Nextra is a full-stack gamified web application with AI chat integration.

- **Frontend**: Next.js 16 (App Router), TypeScript strict mode, MUI v6,
  Redux Toolkit + RTK Query, next-intl for i18n
- **Backend**: C++ 20, Drogon web framework, PostgreSQL 16 via Drogon ORM,
  Conan 2 for dependency management
- **Tooling**: All project automation is C++ (CLI11). No Python scripts,
  no shell scripts anywhere in the project.

### Architecture

```
Browser --> Nginx portal (port 8889) --> Next.js (port 3100)
                                     --> Drogon C++ API (port 8080)
                                               |
                                         PostgreSQL (port 5432)
```

The app is accessed at **`http://localhost:8889/app/en`** (not port 3000
directly). Nginx reverse-proxies `/app` to the Next.js container and
`/api` to the Drogon container.

---

## Code Conventions

### General

- **Line length**: 80 characters maximum for all files.
- **No hardcoded strings**: All user-facing text in translation JSON files.
  All configuration values in JSON constant files.
- **File size**: No file should exceed 100 lines of code. If it does, split
  it into smaller modules. Files approaching the limit (90+ lines) should
  be proactively split — never compress formatting or trim whitespace to
  squeeze under the limit.

### C++ (Backend)

- **Standard**: C++20. Use structured bindings, concepts, ranges, and
  std::format where appropriate.
- **Style**: Linux brace style, 4-space indent (see `.clang-format`).
- **Documentation**: Doxygen-style comments on all public methods and classes.
  Use `@brief`, `@param`, `@return`, `@throws`.
- **Naming**: `PascalCase` for classes, `camelCase` for methods/variables,
  `UPPER_SNAKE_CASE` for constants, `snake_case` for file names.
- **Headers**: Use `#pragma once`. Include what you use.
- **Error handling**: Return `std::expected` or use Drogon's callback
  pattern. No raw exceptions for control flow.
- **JSON**: Use nlohmann/json. Parse with explicit type checks.
- **Logging**: Use spdlog. Levels: trace, debug, info, warn, error, critical.

### TypeScript (Frontend)

- **Strict mode**: `strict: true` in tsconfig.json. No `any` types.
- **Style**: Single quotes, trailing commas, semicolons (see `.prettierrc`).
- **Documentation**: JSDoc on all exported functions, components, hooks,
  and types.
- **Naming**: `PascalCase` for components and types, `camelCase` for
  functions/variables, `UPPER_SNAKE_CASE` for constants.
- **Imports**: Absolute imports via `@/` alias. Group: external, internal,
  types, styles.

### Component Pattern (Atomic Design)

- **Atoms** (`components/atoms/`): Single-responsibility UI primitives.
  Each file under 100 lines. Examples: Button, TextField, Badge, Avatar.
- **Molecules** (`components/molecules/`): Composed from atoms, represent
  a small UI unit. Examples: NotificationBell, ThemeToggle, FormField.
- **Organisms** (`components/organisms/`): Complex UI sections composed
  of molecules and atoms. Examples: Navbar, LoginForm, ChatPanel.
- **Every component must have**:
  - `data-testid` attribute
  - Proper `aria-label` or `aria-describedby`
  - TypeScript props interface with JSDoc
  - Default export

### Custom Hooks

- All stateful logic must live in custom hooks (`hooks/` directory).
- Hooks handle API calls, local state, side effects, and subscriptions.
- Components should only call hooks and render JSX.
- Name hooks with `use` prefix: `useAuth`, `useGamification`, `useAiChat`.

### Constants

- All constant values stored in JSON files under `constants/` directories.
- Frontend: `frontend/src/constants/*.json`
- Backend: `backend/src/constants/*.json`
- Never hardcode magic numbers, URLs, or configuration values.

### File Naming

- **C++ source**: `snake_case.cpp`, `snake_case.h`
  (exception: Drogon controllers/models use `PascalCase`)
- **TypeScript components**: `PascalCase.tsx`
- **TypeScript hooks**: `camelCase.ts` (e.g., `useAuth.ts`)
- **TypeScript utilities**: `camelCase.ts`
- **JSON config/constants**: `kebab-case.json`
- **SQL migrations**: `NNN_description.sql` (e.g., `001_initial_schema.sql`)

---

## CSS / Styling Rules

These rules were established through live debugging — violations cause
hard-to-trace bugs.

### Authoritative Global CSS File

`frontend/src/styles/globals.scss` is the **only** global CSS file that
the Next.js app actually loads. Do not put global rules in
`shared/scss/global/_reset.scss` expecting them to affect the frontend;
that file is not imported by the app layout.

### Viewport Height

Always use `100dvh` (dynamic viewport height), never `100vh`.
On mobile browsers, `100vh` does not account for the browser chrome
(address bar, bottom navigation), causing content to be cut off.

```scss
// Correct
min-height: 100dvh;

// Wrong — breaks mobile
min-height: 100vh;
```

### Overflow and Horizontal Scroll

`overflow-x: hidden` belongs on the `html` element in
`frontend/src/styles/globals.scss`, not in the shared reset.

### Overlay Scroll Containment

Any overlay (drawer, modal, bottom sheet) must have
`overscroll-behavior: contain` to prevent scroll events from
propagating to the body behind it.

```scss
.drawer {
  overscroll-behavior: contain;
}
```

### Body Scroll Lock

Use the `useScrollLock(open: boolean)` hook from
`frontend/src/hooks/useScrollLock.ts` whenever an overlay is open.
It uses `position: fixed` + `top: -Npx` to freeze the body while
preserving scroll position so the page does not jump on close.

### CSS Specificity

Never use `!important`. Win specificity through selector structure.

---

## Debug / Development Flags

### Custom Debug Bar

The in-app debug bar is hidden by default. To enable it:

```bash
# In frontend/.env.local or Docker environment
NEXT_PUBLIC_DEBUG_BAR=1
```

Do not use `process.env.NODE_ENV === 'development'` as the gate — that
is always true in the Docker dev container and the bar would always show.

---

## Testing

### Backend (GTest)

- Test files in `backend/tests/`, named `test_<module>.cpp`.
- One test file per service or utility module.
- Use GTest fixtures for setup/teardown.
- Run: `./manager test` or `ctest` in the build directory.

### Frontend (Jest + React Testing Library)

- Test files colocated or in `__tests__/` directories.
- Name: `<Component>.test.tsx` or `<hook>.test.ts`.
- Test user behavior, not implementation details.
- Run: `cd frontend && npm test`.

### E2E (Playwright - JSON-driven)

- Tests defined in `shared/packages/<name>/playwright/tests.json`.
- Auto-discovered by `shared/e2e/tests.spec.ts`.
- Uses a custom DSL: actions (navigate, click, expect, keyboard,
  evaluate) and matchers (toBeVisible, toHaveCSS, custom scripts).
- Run: `cd shared/e2e && npm test`.

### Running Tests on Windows

MSYS2 / Windows does not have a native GCC. Run backend builds and
tests inside Docker:

```bash
docker run --rm \
  --volume "//d/GitHub/next_extra_primary://src" \
  -w //src/tools/manager \
  gcc:13 bash -c "apt-get install -y libssl-dev -q && make"
```

---

## Important Directories

| Directory                   | Purpose                                    |
|-----------------------------|--------------------------------------------|
| `backend/src/controllers/`  | HTTP route handlers (Drogon controllers)   |
| `backend/src/services/`     | Business logic layer                       |
| `backend/src/models/`       | Drogon ORM generated models                |
| `backend/src/filters/`      | JWT auth, CORS, rate limiting filters      |
| `backend/migrations/`       | SQL migration files (ordered)              |
| `frontend/src/app/`         | Next.js App Router pages and layouts       |
| `frontend/src/components/`  | UI components (atoms/molecules/organisms)  |
| `frontend/src/hooks/`       | Custom React hooks                         |
| `frontend/src/store/`       | Redux store, slices, RTK Query APIs        |
| `frontend/src/theme/`       | MUI theme config and design tokens         |
| `frontend/src/messages/`    | i18n translation JSON files                |
| `backend/src/commands/`     | CLI subcommand handlers                    |
| `tools/manager/`            | Project management CLI (includes cmake-gen)|
| `tools/packagerepo/`        | Package repository manager (own FE + BE)   |
| `tools/s3server/`           | S3-compatible object store for offline use  |
| `shared/`                   | Reusable library (see `shared/README.md`)  |
| `shared/components/m3/`     | M3 component library (125+ components)     |
| `shared/scss/`              | M3 SCSS tokens and atom stylesheets        |
| `shared/e2e/`               | Playwright test infra + JSON test runner   |
| `shared/packages/`          | Per-feature Playwright test suites         |
| `docker/`                   | Pre-baked dependency Dockerfiles            |

---

## Common Tasks

### Adding a New API Endpoint

1. Create or update the controller in `backend/src/controllers/`.
2. Add the service method in `backend/src/services/`.
3. If new tables are needed, create a migration in `backend/migrations/`.
4. Regenerate ORM models: `./manager generate models`.
5. Add GTest tests in `backend/tests/`.
6. Document the endpoint in `docs/api.md`.

### Adding a New Frontend Component

1. Decide if it is an atom, molecule, or organism.
2. Create the file in the appropriate `components/` subdirectory.
3. Keep it under 100 lines. Extract hooks if stateful logic is needed.
4. Add `data-testid`, `aria-label`, and TypeScript props interface.
5. Export from the subdirectory `index.ts` barrel file.
6. Add translations for any user-facing text to all `messages/*.json`.

### Adding a Translation

1. Add the key to `frontend/src/messages/en.json`.
2. Add the same key with translated text to all other locale
   files (`es.json`, `fr.json`, `de.json`, `ja.json`, `zh.json`,
   `nl.json`, `cy.json`).
3. Use `useTranslations('namespace')` in the component.
4. Keys follow dot notation: `"auth.login.title"`.

### Adding a New Locale

1. Create `frontend/src/messages/<code>.json` matching
   the structure of `en.json`.
2. Add the code to `frontend/src/i18n/config.ts` `locales`.
3. Add a label entry in `LocaleSwitcher.tsx` `LOCALE_LABELS`.
4. Routing and navigation update automatically.

### Managing Seed Users

Seed user definitions live in `backend/seeds/users.json` and store
plaintext passwords (hashed only at SQL generation time).

```bash
# Generate INSERT SQL (hashes passwords via PBKDF2-SHA256)
./manager user seed                          # stdout
./manager user seed --output users.sql       # to file

# Apply to the running database
./manager user seed | docker compose exec -T db \
  psql -U nextra -d nextra_db

# Reset a single user's password (outputs SQL UPDATE)
./manager user reset --user devadmin --password NewPass1
./manager user reset --user dev.admin@nextra.local --password NewPass1
```

Password format: `saltHex$600000$dkHex` (PBKDF2-HMAC-SHA256,
16-byte salt, 32-byte DK, 600 000 iterations — NIST SP 800-132).

### Building the Manager Tool

The manager CLI links against OpenSSL (`-lssl -lcrypto`).
On Windows, build inside Docker because MSYS2 has no C++ compiler:

```bash
docker run --rm \
  --volume "//d/GitHub/next_extra_primary://src" \
  -w //src/tools/manager \
  gcc:13 bash -c "apt-get install -y libssl-dev -q && make"
```

After the build the `manager` binary appears in `tools/manager/`.

### Running the Full Stack

```bash
docker compose up --build        # All services
# App available at http://localhost:8889/app/en
```

Or to run services individually:

```bash
cd backend && ./nextra-api serve --port 8080
cd frontend && npm run dev       # port 3100 by default
```

### Applying Frontend Code Changes

The frontend container bakes source at build time — there are no
bind mounts. After editing frontend source files, rebuild only the
frontend container (does not restart backend/db/etc):

```bash
docker compose up --build --no-deps frontend
```

Do NOT use `docker cp` to patch files into a running container.
Rebuild is the correct and only supported workflow.

---

## Key Files to Understand First

1. `plan.md` — Full implementation plan and architecture decisions.
2. `backend/src/main.cpp` — Backend entry point with CLI11 subcommands.
3. `backend/config/config.json` — Drogon server configuration.
4. `frontend/src/app/[locale]/layout.tsx` — Root layout with providers.
5. `frontend/src/styles/globals.scss` — Authoritative global CSS.
6. `frontend/src/store/store.ts` — Redux store configuration.
7. `frontend/src/theme/theme.ts` — MUI theme with color schemes.
8. `docker-compose.yml` — Service orchestration.
9. `docker/nginx/` — Nginx portal config (routes `/app` and `/api`).

---

## Do Not

- Create Python files (`.py`) anywhere in the project.
  (Exception: `backend/conanfile.py` is required by Conan 2 and is
  the only permitted `.py` file.)
- Create shell scripts (`.sh`, `.bash`) anywhere in the project.
- Create any file exceeding 100 lines of code.
- Use `any` type in TypeScript.
- Use `GLOB_RECURSE` in CMake (use `./manager generate cmake`).
- Hardcode strings, URLs, or magic numbers.
- Skip accessibility attributes on interactive components.
- Use raw SQL queries in controllers (use the services layer).
- Commit `.env` files or secrets.
- Put global frontend CSS rules in `shared/scss/global/_reset.scss`
  (that file is not loaded by the Next.js app).
- Use `100vh` for full-height layouts — use `100dvh` instead.
- Use `!important` in CSS — fix specificity through selectors.
- Gate debug UI on `NODE_ENV === 'development'` — use
  `NEXT_PUBLIC_DEBUG_BAR=1` instead.
