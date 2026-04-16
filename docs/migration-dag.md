# Migration DAG

Nextra uses per-domain SQL migrations numbered from `001`. The
migration runner reads a dependency graph and applies domains in
topological order so FK constraints are always satisfied.

---

## Graph file

`services/migration-graph.json` is the authoritative DAG. Each
key is a domain name; its value is an array of domains whose
migrations must be applied first:

```json
{
  "users": [],
  "auth": ["users"],
  "blog": ["users"],
  "social": ["users", "notifications"],
  "job-queue": [],
  "migration-runner": []
}
```

Domains with an empty array have no dependencies and may be
applied in any order relative to each other.

---

## Runner

`services/migration-runner/backend/` performs a topological sort
of the graph and applies each domain's migrations in order. Within
a domain, files are applied in filename order (`001_`, `002_`, …).

Invoke via the `nextra-api migrate` subcommand:

```bash
./nextra-api migrate --up    # apply all pending
./nextra-api migrate --down  # rollback last batch
```

Or through the manager CLI:

```bash
./manager migrate --up
```

Migration state (which files have been applied) is tracked in a
`_migration_state` table created by the runner on first run.

---

## Adding a migration

1. Create the file in `services/<domain>/migrations/` using the
   next sequential number:

   ```
   services/my-domain/migrations/002_add_index.sql
   ```

2. Write standard PostgreSQL DDL. Do not use database-specific
   extensions not already in use.

3. If the migration adds a FK that references another domain's
   table, add or update the dependency in
   `services/migration-graph.json`:

   ```json
   "my-domain": ["users", "other-domain"]
   ```

4. Run migrations:

   ```bash
   ./manager migrate --up
   ```

---

## Declaring a cross-domain FK dependency

Example: `social` has FKs into both `users` and `notifications`.

```json
"social": ["users", "notifications"]
```

This guarantees `users` and `notifications` migrations are fully
applied before any `social` migration runs. The runner detects
cycles and fails fast if the graph is not a DAG.

---

## Per-domain numbering

Each domain starts at `001` independently. The runner tracks
applied files by `(domain, filename)` pair, not by a global
sequence number, so there is no collision:

```
services/auth/migrations/001_auth_schema.sql   -- domain: auth
services/blog/migrations/001_blog_schema.sql   -- domain: blog
```

Both `001` files are distinct entries in `_migration_state`.

---

## Rolling back

The runner applies rollback in reverse topological order. Each
`NNN_description.sql` file may have a corresponding
`NNN_description.down.sql` sibling that is executed on `--down`.
If no `.down.sql` exists the step is skipped with a warning.
