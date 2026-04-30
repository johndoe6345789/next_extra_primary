-- Forum boards configuration table.
-- Boards control visibility, access gating, and sort
-- order for the forum index page.

CREATE TABLE IF NOT EXISTS forum_boards (
    slug            TEXT        PRIMARY KEY,
    label           TEXT        NOT NULL,
    description     TEXT        NOT NULL DEFAULT '',
    icon            TEXT        NOT NULL DEFAULT 'forum',
    requires_auth   BOOLEAN     NOT NULL DEFAULT TRUE,
    min_posts       INTEGER     NOT NULL DEFAULT 0,
    is_guest_visible BOOLEAN    NOT NULL DEFAULT FALSE,
    sort_order      INTEGER     NOT NULL DEFAULT 99,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO forum_boards
    (slug, label, description, icon,
     requires_auth, min_posts, is_guest_visible,
     sort_order)
VALUES
    ('general',
     'General Discussion',
     'Community chat and intros',
     'forum', FALSE, 0, TRUE, 1),
    ('announcements',
     'Announcements',
     'News from the team',
     'campaign', TRUE, 0, FALSE, 2),
    ('support',
     'Help & Support',
     'Stuck? Ask here',
     'help', TRUE, 0, FALSE, 3),
    ('feedback',
     'Feedback & Ideas',
     'Suggestions, bug reports, wishes',
     'lightbulb', TRUE, 0, FALSE, 4),
    ('off-topic',
     'Off-Topic',
     'Coffee, music, anything goes',
     'coffee', FALSE, 0, TRUE, 5),
    ('inner-circle',
     'Members'' Club',
     'Exclusive — 1000-post members only',
     'star', TRUE, 1000, FALSE, 99)
ON CONFLICT (slug) DO NOTHING;
