-- Migration 013: Notification router
--
-- Tables for the notification-router daemon (Phase 1.3).  The daemon
-- consumes Kafka topic `notifications.outbox` and fans out messages
-- to per-channel senders (email, webhook, in-app, push).  The
-- `notifications` table is both the delivery ledger (used for retry
-- and audit) and the storage backing the in-app inbox channel.
--
-- `notification_templates` holds editable subject/body pairs keyed
-- by a stable template key.  Minimal {{var}} substitution is done
-- at dispatch time by services/notifications/TemplateRenderer.
--
-- `notification_prefs` is the user-level opt-in / opt-out per
-- channel.

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID,
    user_id UUID,
    channel TEXT NOT NULL,
    template TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    attempts INT NOT NULL DEFAULT 0,
    sent_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (status IN ('pending','delivered','failed','skipped'))
);

CREATE INDEX notifications_user_idx
    ON notifications(user_id, created_at DESC);
CREATE INDEX notifications_status_idx
    ON notifications(status, created_at DESC);

CREATE TABLE notification_templates (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    channel TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_prefs (
    user_id UUID NOT NULL,
    channel TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (user_id, channel)
);

INSERT INTO notification_templates (key, channel, subject, body)
VALUES
    ('welcome.email', 'email',
     'Welcome to Nextra, {{name}}',
     'Hi {{name}}, thanks for signing up.'),
    ('badge.inapp', 'inapp',
     'New badge unlocked',
     'You earned the {{badge}} badge!'),
    ('password.reset', 'email',
     'Reset your Nextra password',
     'Open {{link}} to reset your password.');
