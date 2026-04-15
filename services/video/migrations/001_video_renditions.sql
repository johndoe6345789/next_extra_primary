-- Migration 013: Video transcoder asset + rendition tables
--
-- Phase 4.2 video-transcoder daemon uses these tables alongside the
-- Phase 1.1 job_queue: POST /api/video uploads create a video_assets
-- row plus a transcode_jobs progress row, then enqueue a
-- `video.transcode` job.  The daemon claims jobs, forks ffmpeg child
-- processes to produce an HLS + DASH ladder and a WebP thumbnail,
-- uploads the artifacts to the in-repo s3server, and records each
-- artifact as a video_renditions row.  progress/status on the
-- transcode_jobs row is updated live as ffmpeg writes key=value
-- progress frames to its -progress pipe.

CREATE TABLE video_assets (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID,
    source_key TEXT NOT NULL,
    duration_ms BIGINT NOT NULL DEFAULT 0,
    width INT NOT NULL DEFAULT 0,
    height INT NOT NULL DEFAULT 0,
    mime TEXT NOT NULL DEFAULT 'video/mp4',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_video_assets_tenant
    ON video_assets (tenant_id, created_at DESC);

CREATE TABLE video_renditions (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL
        REFERENCES video_assets(id) ON DELETE CASCADE,
    kind TEXT NOT NULL
        CHECK (kind IN ('hls','dash','thumb_webp')),
    ladder TEXT NOT NULL DEFAULT '',
    s3_key TEXT NOT NULL,
    bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_video_renditions_asset
    ON video_renditions (asset_id);

CREATE TABLE transcode_jobs (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL
        REFERENCES video_assets(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued'
        CHECK (status IN (
            'queued','running','succeeded','failed')),
    progress SMALLINT NOT NULL DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_transcode_jobs_asset
    ON transcode_jobs (asset_id);
