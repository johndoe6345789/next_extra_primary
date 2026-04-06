# Shared Library (`@metabuilder/*`)

Reusable packages consumed by the main frontend and all
tool frontends (email client, pgadmin, package repo, S3).

## Quick Start

Frontends reference shared code via the `additional_contexts`
Docker BuildKit feature or local symlinks. No separate
install step is needed — each frontend's Dockerfile copies
`shared/` into its build context.

## Directory Map

| Directory     | Package              | What it provides              |
|---------------|----------------------|-------------------------------|
| `components/` | `@shared/m3`         | M3 component library          |
| `scss/`       | `@shared/scss`       | M3 SCSS tokens + atoms        |
| `hooks/`      | `@shared/hooks`      | React hooks (UI, storage)     |
| `redux/`      | `@shared/redux-*`    | Redux slices, middleware      |
| `icons/`      | `@shared/icons`      | Material Symbols + React SVGs |
| `interfaces/` | `@shared/interfaces` | Shared TypeScript contracts   |
| `schemas/`    | —                    | JSON/YAML schema definitions  |
| `e2e/`        | —                    | Playwright test infrastructure|
| `packages/`   | —                    | Per-feature test suites       |
| `storybook/`  | —                    | Visual component docs         |

## Components (`@shared/m3`)

Full Material Design 3 component library built on
Google's official M3 SCSS tokens (from Angular Material).
MUI-compatible API surface for easy migration.

**125+ components** across categories:

- **Inputs**: Button, Select, TextField, Autocomplete,
  Checkbox, Radio, Switch, Slider, DatePicker, etc.
- **Surfaces**: Card, Paper, Accordion, AppBar, Drawer
- **Layout**: Box, Container, Grid, Stack, Flex
- **Data Display**: Typography, Avatar, Badge, Chip,
  Table, List, Tooltip, Markdown
- **Feedback**: Alert, Dialog, Snackbar, Spinner,
  Progress, Skeleton
- **Navigation**: Tabs, Breadcrumbs, Menu, Pagination,
  Stepper, BottomNavigation

## SCSS Token System

Uses `--mat-sys-*` CSS custom properties:

```
--mat-sys-primary, --mat-sys-secondary
--mat-sys-surface, --mat-sys-on-surface
--mat-sys-surface-container-{low,medium,high}
--mat-sys-corner-{none,extra-small,...,full}
--mat-sys-level{1-4}  (elevation)
```

78+ scoped atom stylesheets in `scss/atoms/`.

## Hooks

13 UI hooks, 5 storage hooks (IndexedDB, blob,
offline sync). See `hooks/` for full list.

## Redux

19 packages: core slices, async data, auth, canvas,
email, forms, middleware, adapters, and timing utils.

## E2E Testing

Playwright tests are defined as JSON in
`packages/<name>/playwright/tests.json` and auto-
discovered by `e2e/tests.spec.ts`.

```bash
# Run all tests (requires Node.js + Playwright)
cd shared/e2e && npm test

# Run one package
npm run test:frontend-ui
```

## Adding a Locale

1. Create `frontend/src/messages/<code>.json` copying
   the structure from `en.json`.
2. Add the code to `frontend/src/i18n/config.ts`.
3. Add a label in `LocaleSwitcher.tsx` `LOCALE_LABELS`.

The routing, hook, and navigation all derive from
the config automatically.
