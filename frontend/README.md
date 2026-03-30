# Nextra Frontend

Next.js 16 application with TypeScript strict mode, MUI v7,
Redux Toolkit + RTK Query, and next-intl for i18n.

---

## Quick Start

```bash
npm ci
npm run dev
```

Open http://localhost:3000. API calls proxy to the C++ backend
at `http://localhost:8080` (configurable via `NEXT_PUBLIC_API_URL`).

---

## Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Dev server (Turbopack)         |
| `npm run build`  | Production build               |
| `npm start`      | Start production server        |
| `npm run lint`   | ESLint check                   |

---

## Tech Stack

| Library              | Version | Purpose               |
|----------------------|---------|-----------------------|
| Next.js              | 16.2.x  | App Router framework  |
| React                | 19.x    | UI library            |
| MUI                  | 7.x     | Material Design UI    |
| Redux Toolkit        | 2.x     | State management      |
| next-intl            | latest  | Internationalization  |
| redux-persist        | latest  | State persistence     |

---

## Directory Structure

```
src/
├── app/           Next.js App Router pages
├── components/    atoms / molecules / organisms
├── hooks/         Custom React hooks
├── store/         Redux Toolkit + RTK Query
├── theme/         MUI theme + design tokens
├── i18n/          next-intl configuration
├── messages/      Translation JSON files (en, es)
├── constants/     App constants (JSON)
├── lib/           Utility functions
├── types/         TypeScript type definitions
├── styles/        Global styles
└── seed/          Mock data for development
```

See the root [CLAUDE.md](../CLAUDE.md) for full coding conventions.
