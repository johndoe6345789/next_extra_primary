-- Migration 013: Webhook dispatcher
--
-- Outbound webhook plumbing for the webhook-dispatcher daemon.
-- Operators register endpoints (URL, HMAC secret, event filter),
-- the backend inserts webhook_deliveries rows for matching events,
-- and the dispatcher claims pending deliveries, POSTs them with a
-- signed payload, and schedules retries with exponential backoff.
-- webhook_events is a static catalogue of known event types used by
-- the operator tool to populate the endpoint-editor dropdown.

CREATE TABLE webhook_endpoints (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID,
    url TEXT NOT NULL,
    secret TEXT NOT NULL,
    events TEXT[] NOT NULL DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    failure_streak INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_endpoints_active
    ON webhook_endpoints (active);

CREATE TABLE webhook_deliveries (
    id BIGSERIAL PRIMARY KEY,
    endpoint_id BIGINT NOT NULL
        REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    attempts INT NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_status_code INT,
    last_error TEXT,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (status IN ('pending','retrying','delivered','dead'))
);

CREATE INDEX idx_webhook_deliveries_pending
    ON webhook_deliveries (status, next_retry_at);

CREATE INDEX idx_webhook_deliveries_endpoint
    ON webhook_deliveries (endpoint_id);

CREATE TABLE webhook_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO webhook_events (event_type, description) VALUES
    ('user.created', 'A new user registered'),
    ('user.updated', 'A user profile changed'),
    ('order.placed', 'A shop order was placed'),
    ('order.paid', 'A shop order was paid'),
    ('order.refunded', 'A shop order was refunded'),
    ('comment.posted', 'A new comment was posted'),
    ('blog.published', 'A blog post was published'),
    ('ticket.opened', 'A support ticket was opened')
ON CONFLICT (event_type) DO NOTHING;
