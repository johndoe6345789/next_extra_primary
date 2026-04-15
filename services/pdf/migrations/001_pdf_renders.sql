-- Migration 013: PDF render history
--
-- Tracks every HTML -> PDF render dispatched through the
-- pdf-generator daemon.  The daemon consumes `pdf.render` jobs from
-- the job_queue, delegates actual rendering to the Gotenberg sidecar
-- container, uploads the resulting PDF to the in-repo s3server, and
-- then updates the corresponding row with the resulting s3 key and
-- status.  The admin analytics tool (Phase 6.3) surfaces this table.

CREATE TABLE pdf_renders (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID,
    template TEXT NOT NULL,
    source_html TEXT NOT NULL,
    s3_key TEXT,
    status TEXT NOT NULL DEFAULT 'queued',
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    CHECK (status IN ('queued','rendering','succeeded','failed'))
);

CREATE INDEX idx_pdf_renders_status
    ON pdf_renders (status, created_at DESC);
CREATE INDEX idx_pdf_renders_tenant
    ON pdf_renders (tenant_id, created_at DESC);
