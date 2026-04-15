# primetime — cross-tool portal test suite

A Playwright JSON DSL suite that exercises the
nginx portal across every SSO-gated tool plus the
public surface.

## How to run

From the repo root:

```
cd shared/e2e && npm test
```

The top-level runner
(`shared/e2e/tests.spec.ts`) auto-discovers every
`shared/packages/*/playwright/tests.json`
— including this one — so there is nothing to
register. Verified on the current HEAD of
`tests.spec.ts` (see `discoverAndRegisterTests`).

To run only primetime:

```
cd shared/e2e && \
  npx playwright test -g "primetime"
```

## What each test asserts

| Test                                       | Assertion                                                      |
|--------------------------------------------|----------------------------------------------------------------|
| portal root loads                          | `GET http://localhost:8889/` serves the portal landing page    |
| sso login form renders                     | `/sso/login` renders email + password inputs                   |
| `/jobs` redirects unauthenticated          | Unauthed hit bounces to `/sso/login?next=%2Fjobs`              |
| `/cron` redirects unauthenticated          | Same for `/cron`                                               |
| `/alerts` redirects unauthenticated        | Same for `/alerts`                                             |
| `/emailclient` redirects unauthenticated   | Same for `/emailclient`                                        |
| `/repo` redirects unauthenticated          | Same for `/repo`                                               |
| `/s3` redirects unauthenticated            | Same for `/s3`                                                 |
| `/db` redirects unauthenticated            | Same for `/db`                                                 |
| `/status` is public                        | Public health/status page responds 200 without SSO             |
| `/api/healthz` returns infra keys          | JSON body contains `db`, `redis`, `kafka`, `elasticsearch`     |
| sso login form submits                     | Seeded admin signs in and lands under `/app/*`                 |
| create-a-job in `/jobs`                    | Submit a handler and see it appear in the jobs list            |
| create-a-schedule in `/cron`               | Submit a cron expression, live preview renders, row appears   |

## Phase dependencies

| Feature                 | Delivered by                                   |
|-------------------------|------------------------------------------------|
| Nginx portal on :8889   | v1.0 foundation                                |
| SSO login + redirect    | v1.0 foundation (`tools/sso` + nginx auth_request)|
| `/jobs` create flow     | Phase 1.1 job scheduler                        |
| `/cron` create flow     | Phase 1.1 cron-manager                         |
| `/api/healthz` infra    | Phase 0 infra bootstrap (Redis/Kafka/ES wired) |
| `/status` public page   | Phase 5.6 status tool                          |
| `/emailclient`, `/repo`,| v1.0 (already shipped tool surfaces)           |
| `/s3`, `/db`, `/alerts` |                                                |

Tests for phases not yet merged will fail loudly
with a clear locator error — that's intentional:
the primetime suite is the gate, not a forgiving
smoke. Run the full stack with
`docker compose up --build` before invoking.

## Seeded credentials

Uses the seed user from
`backend/seeds/users.json`:

- email: `dev.admin@nextra.local`
- password: `DevAdmin1`

If you reset seeds, re-run
`./manager user seed` before the suite.
