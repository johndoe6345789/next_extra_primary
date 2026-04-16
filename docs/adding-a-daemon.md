# Adding a New Drogon Daemon

Each long-running background process in Nextra is a CLI subcommand
of the shared `nextra-api` binary. This guide walks through
creating a new one. Use the existing `cron` domain
(`services/cron/`) as the concrete reference.

---

## 1. Create the domain directory

```
services/my-daemon/
  backend/          # C++ service code
  controllers/      # Optional: operator endpoints
  migrations/       # SQL (001_init.sql, ...)
  tests/            # GTest unit tests
  admin/            # Optional: operator Next.js UI
  constants.json    # All tunables (never hardcode)
  README.md         # One-paragraph description
```

Keep every file under 100 lines. Split tick loops, parsers, and
repositories into separate translation units.

Your daemon class needs at minimum:

```cpp
// services/my-daemon/backend/MyDaemon.h
class MyDaemon {
public:
    MyDaemon(std::shared_ptr<drogon::orm::DbClient> db,
             MyDaemonConfig cfg);
    void start();          // spawns worker thread
    void stop();           // asks worker to quit + joins
    void forceTick();      // optional: nudge from controller
};
```

---

## 2. Constants JSON

All tunables live in `services/my-daemon/constants.json`:

```json
{
  "tickIntervalSeconds": 30,
  "gracefulShutdownSeconds": 10
}
```

Never hardcode poll intervals, batch sizes, or seed data.

---

## 3. CLI subcommand

Add the subcommand to
`services/drogon-host/backend/cli_setup_daemons.h`:

```cpp
#include "services/my-daemon/backend/MyDaemon.h"

inline void setupMyDaemonCmd(CLI::App& app) {
    auto* cmd = app.add_subcommand(
        "my-daemon", "Description of what it does");
    std::string cfg = "config/config.json";
    cmd->add_option("--config", cfg, "Drogon config file");
    cmd->callback([cfg]() {
        // 1. Install SIGINT/SIGTERM -> g_stop
        // 2. drogon::app().loadConfigFile(cfg)
        // 3. Read constants.json, build config struct
        // 4. Construct and start daemon
        // 5. Spin-wait on g_stop
        // 6. drogon::app().quit(); daemon.stop();
    });
}
```

Then register it in `services/drogon-host/backend/cli_dispatch.h`:

```cpp
setupMyDaemonCmd(app);
```

Regenerate CMake and build:

```bash
./manager generate cmake
./manager build --debug
```

---

## 4. Controller (optional)

If the daemon needs operator endpoints, create
`services/my-daemon/controllers/MyDaemonController.{h,cpp}`.

To let the controller reach the live daemon instance, expose a
module-local global from the subcommand and read it inside the
controller method:

```cpp
// in cli_setup_daemons.h callback:
namespace nextra::mydaemon {
    MyDaemon* g_daemon = nullptr;
}
nextra::mydaemon::g_daemon = &daemon;
```

The controller is linked into the `backend` (`serve`) daemon, not
the `my-daemon` daemon. Endpoints are already reachable under
`/api/...` via the nginx `/api/` location.

---

## 5. Migration

If the domain needs tables, add SQL files under
`services/my-daemon/migrations/` starting from `001_init.sql`.

If any table has a FK into another domain, declare the dependency
in `services/migration-graph.json`:

```json
"my-daemon": ["users"]
```

The migration runner reads this DAG and applies domains in
topological order. See `docs/migration-dag.md`.

---

## 6. docker-compose service

Add a service to `docker-compose.yml` that reuses the same
`drogon-host` build context and overrides the command:

```yaml
my-daemon:
  build:
    context: ./services/drogon-host
    additional_contexts:
      services: ./services
      shared: ./shared
    args:
      DEPS_IMAGE: debian:sid
      RUNTIME_IMAGE: debian:sid-slim
  command: ["./nextra-api", "my-daemon",
            "--config", "config/config.json"]
  depends_on:
    db:
      condition: service_healthy
  environment:
    DB_HOST: db
    DB_PORT: "5432"
    DB_NAME: nextra_db
    DB_USER: nextra
    DB_PASSWORD: nextra_dev
  restart: unless-stopped
```

The build layer is shared with `backend`, `job-scheduler`, and
`cron-manager` — only the first build is slow.

---

## 7. Nginx location (if the daemon has its own HTTP)

If the daemon runs Drogon's HTTP server on its own port, add a
`location /my-daemon` block to `docker/nginx/nginx.conf`:

```nginx
location /my-daemon {
    auth_request /_sso_validate;
    error_page 401 = @sso_login;
    set $upstream http://my-daemon:PORT;
    proxy_pass $upstream;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

If you linked the controller into `backend` (Option A above) no
nginx change is needed.

---

## 8. Tests

Add GTest coverage under `services/my-daemon/tests/`:

- Unit test the core algorithm in isolation.
- Unit test the repository layer against a disposable Postgres.
- Integration test the tick loop with a mocked clock.

Run: `./manager test`.

---

## 9. Documentation

Add a section to `docs/services.md` and a row to the domain
table in `docs/domains.md`.
