-- Email inbox tables for IMAP sync integration.
-- Stores account credentials and synced messages
-- in the main Nextra database so the Drogon
-- backend can serve the email client directly.

CREATE TABLE IF NOT EXISTS email_accounts (
    id          UUID PRIMARY KEY
                DEFAULT uuid_generate_v4(),
    tenant_id   VARCHAR(64) NOT NULL
                DEFAULT 'default',
    user_id     UUID REFERENCES users(id)
                ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,

    -- IMAP settings
    imap_host   VARCHAR(255),
    imap_port   INTEGER DEFAULT 143,
    imap_user   VARCHAR(255),
    imap_pass   VARCHAR(512),

    -- Sync state
    last_sync_at TIMESTAMPTZ,
    last_sync_uid INTEGER DEFAULT 0,
    sync_status VARCHAR(32) DEFAULT 'idle',

    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_accounts_user
    ON email_accounts(user_id);

CREATE TABLE IF NOT EXISTS email_messages (
    id          UUID PRIMARY KEY
                DEFAULT uuid_generate_v4(),
    account_id  UUID NOT NULL
                REFERENCES email_accounts(id)
                ON DELETE CASCADE,
    uid         INTEGER,
    folder      VARCHAR(255) DEFAULT 'INBOX',

    subject     VARCHAR(1024),
    from_addr   VARCHAR(512),
    to_addrs    TEXT,
    cc_addrs    TEXT,

    body_text   TEXT,
    body_html   TEXT,
    has_attach  BOOLEAN DEFAULT FALSE,

    is_read     BOOLEAN DEFAULT FALSE,
    is_starred  BOOLEAN DEFAULT FALSE,
    date_sent   TIMESTAMPTZ,
    date_recv   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_messages_account
    ON email_messages(account_id);
CREATE INDEX idx_email_messages_folder
    ON email_messages(account_id, folder);
CREATE INDEX idx_email_messages_date
    ON email_messages(date_recv DESC);
