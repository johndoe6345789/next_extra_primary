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
Next.js (port 3000) <-- REST/JSON --> Drogon C++ API (port 8080)
                                            |
                                      PostgreSQL (port 5432)
```

---

## Code Conventions

### General

- **Line length**: 80 characters maximum for all files.
- **No hardcoded strings**: All user-facing text in translation JSON files.
  All configuration values in JSON constant files.
- **File size**: No file should exceed 100 lines of code. If it does, split
  it into smaller modules.

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
| `tools/cmake-gen/`          | CMakeLists.txt generator tool              |
| `tools/manager/`            | Project management CLI tool                |

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
2. Add the same key with translated text to `frontend/src/messages/es.json`
   (and any other locale files).
3. Use `useTranslations('namespace')` in the component.
4. Keys follow dot notation: `"auth.login.title"`.

### Running the Full Stack

```bash
docker compose up --build        # All services
# or manually:
cd backend && ./nextra-api serve --port 8080
cd frontend && npm run dev
```

---

## Key Files to Understand First

1. `plan.md` -- Full implementation plan and architecture decisions.
2. `backend/src/main.cpp` -- Backend entry point with CLI11 subcommands.
3. `backend/config/config.json` -- Drogon server configuration.
4. `frontend/src/app/layout.tsx` -- Root layout with provider stack.
5. `frontend/src/store/store.ts` -- Redux store configuration.
6. `frontend/src/theme/theme.ts` -- MUI theme with color schemes.
7. `docker-compose.yml` -- Service orchestration.

---

## Do Not

- Create Python files (`.py`) anywhere in the project.
- Create shell scripts (`.sh`, `.bash`) anywhere in the project.
- Create any file exceeding 100 lines of code.
- Use `any` type in TypeScript.
- Use `GLOB_RECURSE` in CMake (use the cmake-gen tool instead).
- Hardcode strings, URLs, or magic numbers.
- Skip accessibility attributes on interactive components.
- Use raw SQL queries in controllers (use the services layer).
- Commit `.env` files or secrets.
