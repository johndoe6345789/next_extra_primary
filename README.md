# Nextra (Next.js + C++ Extra)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack gamified web application template with AI chat integration — Next.js frontend, C++/Drogon backend, organized as a domain-sliced monorepo.

**Status**: Being split into many single-purpose repos — see [reposplit](https://github.com/johndoe6345789/reposplit) for the full breakdown of what moved where and why.

## What's Left Here

`services/`, `shared/`, and `frontend/` have all been migrated out. What remains is build/deploy tooling: `cmake/`, `docker/`, `deploy/`, Conan build scripts, and `docs/`.

## Where Everything Went

See the [reposplit README](https://github.com/johndoe6345789/reposplit#readme) for the full mapping. In short:
- `frontend/` → [nextra-frontend](https://github.com/johndoe6345789/nextra-frontend)
- `shared/` + `services/design-system` → [design-system](https://github.com/johndoe6345789/design-system)
- Core platform services (`auth`, `sso`, `users`, `database`, `job-queue`, `cron`, `portal`, `object-store`, etc.) → [platform-core](https://github.com/johndoe6345789/platform-core)
- Gamification (`gamification`, `badges`, `leaderboards`, `levels`, `streaks`, `xp`, `progress`) → [gamification](https://github.com/johndoe6345789/gamification)
- Social → [social](https://github.com/johndoe6345789/social)
- AI chat → [ai-chat](https://github.com/johndoe6345789/ai-chat)
- Content/media (`media-service`, `image`, `video`, `pdf`, `content-service`) → [content-service](https://github.com/johndoe6345789/content-service)
- Search → [search](https://github.com/johndoe6345789/search)
- Analytics → [analytics](https://github.com/johndoe6345789/analytics)
- Notifications (`notifications`, `email`, `webhooks`, `imap-sync`, `alerts`) → [notifications](https://github.com/johndoe6345789/notifications)
- Ecommerce → [ecommerce](https://github.com/johndoe6345789/ecommerce)
- `wiki` → [wiki](https://github.com/johndoe6345789/wiki), `comments` → [comments](https://github.com/johndoe6345789/comments), `polls` → [polls](https://github.com/johndoe6345789/polls), `gallery` → [gallery](https://github.com/johndoe6345789/gallery), `blog` → [blog](https://github.com/johndoe6345789/blog) — not pyracms, which is a separate existing project
- `package-repository` → [goodpackagerepo](https://github.com/johndoe6345789/goodpackagerepo)
- `streaming` → [media_center](https://github.com/johndoe6345789/media_center)
