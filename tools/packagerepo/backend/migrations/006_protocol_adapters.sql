-- 006_protocol_adapters.sql
-- Declarative protocol adapter config per repo type.
-- Fully relational — no JSONB blobs.

CREATE TABLE IF NOT EXISTS protocol_adapters (
    id            SERIAL PRIMARY KEY,
    repo_type     INTEGER REFERENCES repo_types(id),
    name          TEXT NOT NULL,
    prefix        TEXT NOT NULL,
    namespace     TEXT NOT NULL,
    content_type  TEXT NOT NULL DEFAULT 'application/octet-stream',
    tarball_ext   TEXT NOT NULL DEFAULT '.bin',
    meta_format   TEXT NOT NULL DEFAULT '',
    enabled       BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (repo_type, name)
);

-- Seed adapters for the default generic repo type.
INSERT INTO protocol_adapters
    (repo_type, name, prefix, namespace,
     content_type, tarball_ext, meta_format)
SELECT rt.id, 'npm', '/npm', 'npm',
       'application/octet-stream', '.tgz',
       'npm-registry-v1'
FROM repo_types rt WHERE rt.name = 'generic'
ON CONFLICT (repo_type, name) DO NOTHING;

INSERT INTO protocol_adapters
    (repo_type, name, prefix, namespace,
     content_type, tarball_ext, meta_format)
SELECT rt.id, 'apt', '/apt', 'apt',
       'application/vnd.debian.binary-package', '.deb',
       'apt-packages'
FROM repo_types rt WHERE rt.name = 'generic'
ON CONFLICT (repo_type, name) DO NOTHING;

INSERT INTO protocol_adapters
    (repo_type, name, prefix, namespace,
     content_type, tarball_ext, meta_format)
SELECT rt.id, 'conan', '/conan', 'conan',
       'application/gzip', '.tgz',
       'conan-v2'
FROM repo_types rt WHERE rt.name = 'generic'
ON CONFLICT (repo_type, name) DO NOTHING;
