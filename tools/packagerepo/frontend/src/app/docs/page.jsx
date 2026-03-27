import styles from './page.module.scss';

export default function DocsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Documentation</h1>
        <p>Complete guide to using the Package Repository</p>
      </div>

      <div className={styles.toc}>
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#getting-started">Getting Started</a></li>
          <li><a href="#api-usage">API Usage</a></li>
          <li><a href="#schema">Schema Configuration</a></li>
        </ul>
      </div>

      <div className={styles.content}>
        <h2 id="getting-started">Getting Started</h2>
        <p>
          This is a schema-driven package repository with
          secure, content-addressed artifact storage backed
          by PostgreSQL and a C++ Drogon backend.
        </p>

        <h3>Quick Start</h3>
        <pre><code>{`# Build and start with the manager CLI
./manager repo build
./manager repo up

# Or use Docker Compose directly
cd tools/packagerepo
docker compose up -d

# Frontend:  http://localhost:3000
# Backend:   http://localhost:5050
# Endpoints: /health, /v1/*, /admin/*`}</code></pre>

        <h3>Manager Commands</h3>
        <pre><code>{`./manager repo build   # Build backend image
./manager repo up      # Start stack (DB + backend)
./manager repo down    # Stop stack
./manager repo status  # Show container status
./manager repo logs    # Tail backend logs`}</code></pre>

        <h2 id="api-usage">API Usage</h2>

        <h3>Authentication</h3>
        <p>
          Most endpoints require a Bearer token. Get one
          via the login endpoint:
        </p>
        <pre><code>{`curl -X POST http://localhost:5050/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"admin"}'

# Response: { "token": "...", "user": {...} }
# Use token in subsequent requests:
Authorization: Bearer YOUR_TOKEN`}</code></pre>

        <h3>Publishing a Package</h3>
        <pre><code>{`curl -X PUT \\
  -H "Authorization: Bearer $TOKEN" \\
  --data-binary @package.tar.gz \\
  http://localhost:5050/v1/acme/myapp/1.0.0/linux-amd64/blob`}</code></pre>

        <h3>Downloading a Package</h3>
        <pre><code>{`curl -H "Authorization: Bearer $TOKEN" \\
  http://localhost:5050/v1/acme/myapp/1.0.0/linux-amd64/blob \\
  -o myapp.tar.gz`}</code></pre>

        <h3>Getting Latest Version</h3>
        <pre><code>{`curl -H "Authorization: Bearer $TOKEN" \\
  http://localhost:5050/v1/acme/myapp/latest`}</code></pre>

        <h3>Listing Versions</h3>
        <pre><code>{`curl -H "Authorization: Bearer $TOKEN" \\
  http://localhost:5050/v1/acme/myapp/versions`}</code></pre>

        <h3>Browse All Packages</h3>
        <pre><code>{`curl http://localhost:5050/v1/packages`}</code></pre>

        <h3>Setting a Tag</h3>
        <pre><code>{`curl -X PUT \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"target_version":"1.0.0","target_variant":"linux-amd64"}' \\
  http://localhost:5050/v1/acme/myapp/tags/stable`}</code></pre>

        <h2 id="schema">Schema Configuration</h2>
        <p>
          The repository uses a declarative schema stored in
          PostgreSQL to define its behavior:
        </p>
        <ul>
          <li><strong>Entities</strong>: Data models with
            validation and normalization rules</li>
          <li><strong>Storage</strong>: Content-addressed
            blob stores with SHA256 verification</li>
          <li><strong>Auth</strong>: Scope-based permissions
            (read, write, admin)</li>
          <li><strong>Features</strong>: Mutable tags,
            overwrite control, proxy support</li>
          <li><strong>Events</strong>: Append-only audit log
            for artifact lifecycle</li>
        </ul>
        <p>
          View the full schema configuration in the Admin
          panel or at the <code>/schema</code> endpoint.
        </p>
      </div>
    </div>
  );
}
