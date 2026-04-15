# Adding a New Drogon Daemon

The backend binary `nextra-api` is a CLI11 multi-subcommand
program defined in `backend/src/main.cpp`. Each subcommand in
`backend/src/commands/` is potentially a separate long-running
daemon that docker-compose runs as its own service. This guide
walks through adding one, using the existing `cron-manager`
(`backend/src/commands/cron_manager.cpp`) as the worked example.

---

## 1. Services directory

Put the core logic under `backend/src/services/<your-module>/`.
Keep files under 100 lines — split tick loops, parsers, and
repositories into separate translation units. Cron does this:

```
backend/src/services/cron/
├── CronManager.h / CronManager.cpp   ← lifecycle + class
├── CronExpression.h                   ← types
├── CronTypes.h
├── cron_expression_parse.cpp          ← parser
├── cron_expression_next.cpp           ← next-fire scan
├── cron_manager_seeds.cpp             ← seedSchedules loader
└── cron_manager_tick.cpp              ← per-tick evaluation
```

Your daemon class needs at minimum:

- A constructor taking `std::shared_ptr<drogon::orm::DbClient>`
  and a config struct.
- `void start()` — spawns an internal worker thread.
- `void stop()` — asks the worker to quit and joins.
- `void forceTick()` (optional) — for operator endpoints that
  want to nudge the loop from the outside.

---

## 2. Constants JSON

Every tunable (poll interval, batch size, shutdown grace period,
seed data) lives in a JSON file under
`backend/src/constants/<daemon-name>.json`. Never hardcode these.
Cron uses `cron-manager.json`; jobs uses `job-scheduler.json`.

The CLI subcommand reads this file at startup and builds a
config struct before constructing the daemon class.

---

## 3. CLI subcommand

Create `backend/src/commands/<name>.h` and
`backend/src/commands/<name>.cpp`. The `.cpp` should:

1. Install `SIGINT` / `SIGTERM` handlers that flip a global
   `std::atomic<bool> g_stop`.
2. `drogon::app().loadConfigFile(config)` so the daemon has
   a DB client.
3. Read `constants/<name>.json`, build the config struct.
4. Construct the daemon, call `start()`.
5. Start `drogon::app().run()` on a background thread if the
   daemon is going to serve HTTP (see below).
6. Spin-wait on `g_stop`.
7. Call `drogon::app().quit()`, join the HTTP thread, then
   `daemon.stop()`.

`cron_manager.cpp` is the smallest complete example (under 80
lines). Copy it and rename.

---

## 4. Controller (optional)

If your daemon needs to expose operator endpoints (like the
cron force-tick button) you have two choices:

**Option A — link the controller into `backend`** (what cron and
jobs currently do). The controller is just a normal
`drogon::HttpController`, mounted by the main `serve` daemon.
To reach the live daemon instance, expose a module-local
global pointer from the subcommand file, set in
`cmd<Name>()`, read inside the controller method. See
`backend/src/commands/cron_manager.cpp` for the pattern:

```cpp
namespace nextra::cron {
CronManager* g_cronManager = nullptr;
}
// ...
nextra::cron::g_cronManager = &manager;
```

**Option B — run Drogon inside the daemon itself**. If you want
the daemon to own its HTTP surface (so it works even when
`backend` is down), start `drogon::app().run()` on a thread
from the subcommand, and make sure your `config.json` listener
port is unique per daemon.

---

## 5. Wire the subcommand into `main.cpp`

Add the subcommand declaration to `backend/src/main.cpp`:

```cpp
#include "commands/<name>.h"
// ...
auto* cmd = app.add_subcommand("<name>", "...");
std::string cfg = "config/config.json";
cmd->add_option("--config", cfg, "Drogon config file");
cmd->callback([&]() { commands::cmd<Name>(cfg); });
```

Then regenerate the CMake file list so the new sources are
compiled in:

```bash
./manager generate cmake
./manager build --debug
```

---

## 6. docker-compose service

Add an entry to `docker-compose.yml` that reuses the same
`backend` build context and just overrides the command. Cron
looks like this:

```yaml
cron-manager:
  build:
    context: ./backend
    additional_contexts:
      manager: ./tools/manager
      commands: ./.local/commands
    args:
      DEPS_IMAGE: debian:sid
      RUNTIME_IMAGE: debian:sid-slim
  command: ["./nextra-api", "cron-manager",
            "--config", "config/config.json"]
  depends_on:
    db:
      condition: service_healthy
    job-scheduler:
      condition: service_started
  environment:
    DB_HOST: db
    DB_PORT: "5432"
    DB_NAME: nextra_db
    DB_USER: nextra
    DB_PASSWORD: nextra_dev
  restart: unless-stopped
```

The build layer is cached across the `backend`, `job-scheduler`,
and `cron-manager` services because they share the same Docker
context — only the first build is slow.

---

## 7. Nginx location (if the daemon has a UI or own HTTP)

If you chose Option B above, add a `location /<path>` block to
`docker/nginx/nginx.conf` that `proxy_pass`es to the daemon's
container name and port. Decide whether to gate it behind
`auth_request /_sso_validate` or leave it open — all UI routes
should be gated; raw API routes used by CLI tools may not be.

If you chose Option A, you do not need an nginx change — your
controller is already reachable under `/api/...`.

---

## 8. Tests

Add GTest coverage under `backend/tests/`:

- Unit test the parser / core algorithm in isolation.
- Unit test the repository layer against a disposable Postgres.
- Integration test the daemon's tick loop with a mocked clock.

Run with `./manager test`.

---

## 9. Documentation

Add a section to `docs/services.md` describing the new daemon
(CLI, source file, compose service, purpose, key env vars,
config file). If it has a UI tool, add a section to
`docs/tools.md` too.
