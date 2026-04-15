-- Migration 013: Live streaming control plane
--
-- Drogon sidecar daemon `media-streaming` manages a mediamtx container
-- that serves RTSP ingest, WebRTC low-latency playback, and HLS fan-out.
-- This table records each live session so the operator tool and the main
-- app can discover, kick, and replay streams.  ingest_key is a 24-byte
-- hex token the publisher embeds in the RTSP path; mediamtx hits the
-- /api/streams/hook/publish webhook which flips status to 'live'.
-- recording_key is an s3 object key populated when the session ends.

CREATE TABLE live_streams (
    id             BIGSERIAL PRIMARY KEY,
    tenant_id      UUID,
    owner_id       UUID,
    slug           TEXT UNIQUE NOT NULL,
    title          TEXT NOT NULL,
    ingest_key     TEXT UNIQUE NOT NULL,
    status         TEXT NOT NULL DEFAULT 'idle',
    started_at     TIMESTAMPTZ,
    ended_at       TIMESTAMPTZ,
    recording_key  TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (status IN ('idle','live','ended','blocked'))
);
CREATE INDEX idx_live_streams_status
    ON live_streams (status, started_at DESC);
CREATE INDEX idx_live_streams_owner ON live_streams (owner_id);
CREATE INDEX idx_live_streams_tenant ON live_streams (tenant_id);

CREATE TABLE stream_viewers (
    id         BIGSERIAL PRIMARY KEY,
    stream_id  BIGINT NOT NULL
        REFERENCES live_streams(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    left_at    TIMESTAMPTZ
);
CREATE INDEX idx_stream_viewers_stream
    ON stream_viewers (stream_id, joined_at DESC);
CREATE INDEX idx_stream_viewers_open
    ON stream_viewers (stream_id)
    WHERE left_at IS NULL;
