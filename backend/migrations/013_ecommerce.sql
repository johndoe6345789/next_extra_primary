-- Phase 5.1 — Ecommerce schema
-- Products, carts, orders, line items

CREATE TABLE IF NOT EXISTS products (
    id           BIGSERIAL PRIMARY KEY,
    tenant_id    BIGINT      NOT NULL DEFAULT 0,
    sku          TEXT        NOT NULL UNIQUE,
    name         TEXT        NOT NULL,
    description  TEXT        NOT NULL DEFAULT '',
    price_cents  INTEGER     NOT NULL CHECK (price_cents >= 0),
    currency     TEXT        NOT NULL DEFAULT 'USD',
    stock        INTEGER     NOT NULL DEFAULT 0,
    active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_tenant_active_idx
    ON products (tenant_id, active);

CREATE TABLE IF NOT EXISTS carts (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS carts_user_idx ON carts (user_id);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_id    BIGINT  NOT NULL
        REFERENCES carts (id) ON DELETE CASCADE,
    product_id BIGINT  NOT NULL
        REFERENCES products (id) ON DELETE RESTRICT,
    qty        INTEGER NOT NULL CHECK (qty > 0),
    PRIMARY KEY (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT      NOT NULL,
    status       TEXT        NOT NULL DEFAULT 'pending',
    total_cents  INTEGER     NOT NULL CHECK (total_cents >= 0),
    currency     TEXT        NOT NULL DEFAULT 'USD',
    stripe_pi    TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at      TIMESTAMPTZ,
    shipped_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_stripe_pi_idx
    ON orders (stripe_pi) WHERE stripe_pi IS NOT NULL;

CREATE TABLE IF NOT EXISTS order_items (
    order_id    BIGINT  NOT NULL
        REFERENCES orders (id) ON DELETE CASCADE,
    product_id  BIGINT  NOT NULL
        REFERENCES products (id) ON DELETE RESTRICT,
    qty         INTEGER NOT NULL CHECK (qty > 0),
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    PRIMARY KEY (order_id, product_id)
);
