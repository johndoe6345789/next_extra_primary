# Domain Catalogue

Every feature in Nextra lives under `services/<domain>/` as a
self-contained slice. The refactor split the old monolithic
`backend/` and `tools/` trees into these 55+ domains, each with
its own `README.md`, backend sources, controllers, migrations,
tests, and (if applicable) one or more Next.js UIs under
audience-labelled subfolders.

See [domain-layout.md](domain-layout.md) for the canonical
subfolder rules and [architecture.md](architecture.md) for how
everything is linked together at build time.

---

## All domains

| Domain | Description |
|--------|-------------|
| [ai-chat](../services/ai-chat/README.md) | AI chat integration — Claude/OpenAI clients, chat history, controllers. |
| [alerts](../services/alerts/README.md) | Operator alerting admin tool. |
| [analytics](../services/analytics/README.md) | Metrics collection and time-series queries. |
| [api-documentation](../services/api-documentation/README.md) | OpenAPI spec generation and viewer UI. |
| [api-keys](../services/api-keys/README.md) | User and system API key CRUD and validation. |
| [audit](../services/audit/README.md) | Hash-chained audit log consumer and verifier. |
| [auth](../services/auth/README.md) | Authentication: sessions, tokens, OAuth, passkeys, TOTP, registration. |
| [backup](../services/backup/README.md) | Nightly pg_dump backup runner and admin UI. |
| [badges](../services/badges/README.md) | Badge catalogue and user badge awards. |
| [blog](../services/blog/README.md) | Article/blog storage, markdown rendering, publisher. |
| [comments](../services/comments/README.md) | Polymorphic threaded comments and forum moderation. |
| [cron](../services/cron/README.md) | Cron-expression scheduler and manager daemon. |
| [database](../services/database/README.md) | Self-contained pgAdmin-style database admin tool. |
| [design-system](../services/design-system/README.md) | Component catalogue and M3 prop editor. |
| [drogon-host](../services/drogon-host/README.md) | Drogon app shell: main.cpp, serve command, config, filters link point. |
| [ecommerce](../services/ecommerce/README.md) | Shop catalog, cart, checkout, Stripe webhook, admin UI. |
| [elasticsearch](../services/elasticsearch/README.md) | ElasticClient — shared low-level search index client. |
| [email](../services/email/README.md) | SMTP/IMAP email service, templates, and webmail UI. |
| [feature-flags](../services/feature-flags/README.md) | Flag evaluator, store, and admin UI. |
| [gallery](../services/gallery/README.md) | Photo gallery / album storage and bulk import. |
| [gamification](../services/gamification/README.md) | Gamification facade: XP/level/streak/progress aggregator. |
| [http-filters](../services/http-filters/README.md) | Drogon HTTP filters: JWT, cookie auth, CORS, rate-limit buckets. |
| [i18n](../services/i18n/README.md) | Translation service, coverage, upsert, admin controllers. |
| [image](../services/image/README.md) | Image-processing jobs and libvips/S3 uploader worker. |
| [imap-sync](../services/imap-sync/README.md) | IMAP fetch + sync worker for email accounts. |
| [infra](../services/infra/README.md) | Kafka and Redis client shims and factories. |
| [job-queue](../services/job-queue/README.md) | Durable job queue, scheduler, worker, backoff. |
| [leaderboards](../services/leaderboards/README.md) | Leaderboard queries (XP / points). |
| [levels](../services/levels/README.md) | Level calculation from XP. |
| [manager-cli](../services/manager-cli/README.md) | Standalone C++ manager CLI (project automation). |
| [migration-runner](../services/migration-runner/README.md) | Topo-sorted per-domain SQL migration runner. |
| [notifications](../services/notifications/README.md) | Notification router, channel senders, templates. |
| [object-store](../services/object-store/README.md) | Self-contained S3-compatible object store. |
| [orm-models](../services/orm-models/README.md) | Drogon ORM generated model files. |
| [package-repository](../services/package-repository/README.md) | Self-contained package repository manager (FE + BE). |
| [pdf](../services/pdf/README.md) | HTML -> PDF rendering via Gotenberg. |
| [polls](../services/polls/README.md) | Poll store, voting, results. |
| [progress](../services/progress/README.md) | Per-user progress tracking. |
| [rate-limit](../services/rate-limit/README.md) | Token-bucket rate limiting (Redis-backed). |
| [search](../services/search/README.md) | Elasticsearch index registry, indexer daemon, query service. |
| [social](../services/social/README.md) | Follows, DMs, presence, reactions, mentions, groups. |
| [sso](../services/sso/README.md) | Self-contained SSO portal (login, token bridge). |
| [status-page](../services/status-page/README.md) | Public status page and incident history. |
| [streaks](../services/streaks/README.md) | Daily streak computation. |
| [streaming](../services/streaming/README.md) | mediamtx control plane and ingest key management. |
| [user-lookup](../services/user-lookup/README.md) | Cross-domain user lookup helper. |
| [user-preferences](../services/user-preferences/README.md) | Theme/locale/AI provider preferences. |
| [user-profiles](../services/user-profiles/README.md) | Extended user profile data. |
| [user-search](../services/user-search/README.md) | User search queries. |
| [user-stats](../services/user-stats/README.md) | User statistics aggregation. |
| [users](../services/users/README.md) | User CRUD, admin role/active, profile, stats. |
| [video](../services/video/README.md) | FFmpeg HLS/DASH transcoder daemon. |
| [webhooks](../services/webhooks/README.md) | Webhook endpoints, deliveries, circuit breaker, HMAC. |
| [wiki](../services/wiki/README.md) | Wiki pages, revisions, tree, markdown sanitization. |
| [xp](../services/xp/README.md) | XP awards, leaderboards feeder. |
