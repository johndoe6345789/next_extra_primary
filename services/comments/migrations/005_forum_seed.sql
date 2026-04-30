-- 005: phpBB-style forum seed data.
-- Creates 5 boards, ~15 threads, and ~50 replies
-- across the seeded users so the /forum page shows
-- realistic content. Idempotent: skips if any forum
-- threads already exist.

DO $$
DECLARE
    -- Seed-user UUIDs (must match users seed).
    u_admin     UUID := '0e276adf-8bb9-41af-95df-162ff4d5e2fd';
    u_user      UUID := 'da0ad867-f9e4-4d87-a710-05585f7238bb';
    u_mod       UUID := '4cc85430-01f1-4b08-9057-aa75994bc06a';
    u_legacy    UUID := 'd1f8c9a9-ad0e-4362-9a6e-1f0384fbf423';
    u_legacy_a  UUID := 'ecc1e92d-b176-455b-b6e0-c1241ded3ce6';

    -- Captured thread IDs after each insert.
    t_id BIGINT;

    -- Cursor for the post loop.
    p RECORD;
BEGIN
    -- Skip if data already exists.
    IF EXISTS (
        SELECT 1 FROM comments_v2
        WHERE target_type = 'forum_board'
          AND deleted_at IS NULL
        LIMIT 1
    ) THEN
        RAISE NOTICE 'forum seed skipped (data present)';
        RETURN;
    END IF;

    -- Threads + their opening posts. Replies follow.
    FOR p IN SELECT * FROM (VALUES
        -- (board_slug, title, author, body, age_days, replies)
        ('general',
         'Welcome to the Nextra forum!',
         u_admin,
         'Hey everyone — this is our brand new community '
         'space. Introduce yourself, share what you''re '
         'working on, and have fun!',
         14,
         5),
        ('general',
         'Introduce yourself',
         u_mod,
         'Drop a quick hello in this thread. Who are you, '
         'where are you from, what brought you here?',
         12,
         8),
        ('general',
         'Weekly community chat — thread #1',
         u_user,
         'What did everyone get up to this week? '
         'Anything cool you want to share?',
         3,
         4),

        ('announcements',
         'Beta is now open',
         u_admin,
         'Nextra is officially in open beta. Thanks to '
         'everyone who tested with us. Bug reports and '
         'feedback welcome — see the support board.',
         20,
         3),
        ('announcements',
         'Roadmap Q2 — what''s coming',
         u_admin,
         'Heads up on the next quarter: live events, '
         'mobile push, marketplace pilot, and a major '
         'upgrade to the dashboard widgets.',
         9,
         2),

        ('support',
         'How do I reset my password?',
         u_user,
         'I forgot my password and the email reset link '
         'isn''t showing up in my inbox. Anyone seen this?',
         7,
         3),
        ('support',
         'Mobile app keeps crashing on launch',
         u_legacy,
         'Reproducible on iOS 17.4 — open the app, see '
         'splash, then it dies. Logs attached below.',
         5,
         4),
        ('support',
         'Two-factor codes not working',
         u_legacy_a,
         'TOTP codes from Authy keep coming back as '
         'invalid. Clock drift is fine. Anyone else?',
         2,
         2),

        ('feedback',
         'Love the dark mode',
         u_user,
         'Just wanted to say the new dark mode looks '
         'amazing. The contrast on the dashboard is '
         'finally readable at night.',
         11,
         3),
        ('feedback',
         'Feature request: global search',
         u_mod,
         'Would love a top-bar search that hits forum '
         'posts, blog entries, and wiki pages all at '
         'once. Like Spotlight.',
         8,
         5),
        ('feedback',
         'Notifications are too noisy',
         u_legacy,
         'Getting pinged for every comment reaction is '
         'overkill. Can we get a "weekly digest only" '
         'option in preferences?',
         4,
         2),

        ('off-topic',
         'What are you reading right now?',
         u_user,
         'Currently halfway through "The Pragmatic '
         'Programmer (20th anniv)". What''s on your '
         'nightstand?',
         13,
         6),
        ('off-topic',
         'Show us your desk setup',
         u_mod,
         'Post a pic of your workspace. Bonus points '
         'for plants and weird mechanical keyboards.',
         6,
         4),
        ('off-topic',
         'Favourite coffee?',
         u_legacy_a,
         'Single-origin pour-over Ethiopian or fight me. '
         'What''s your daily driver?',
         1,
         3)
    ) AS data(slug, title, author, body, age, replies)
    LOOP
        -- Insert the thread (target_type=forum_board)
        -- and capture its id for the reply loop.
        INSERT INTO comments_v2 (
            target_type, target_id, author_id,
            title, body, depth, created_at, updated_at
        )
        VALUES (
            'forum_board', p.slug, p.author,
            p.title, p.body, 0,
            NOW() - (p.age || ' days')::INTERVAL,
            NOW() - (p.age || ' days')::INTERVAL
        )
        RETURNING id INTO t_id;

        -- Set the materialized path on the new thread.
        UPDATE comments_v2 SET path = text2ltree(t_id::text)
        WHERE id = t_id;

        -- Generate p.replies replies, alternating authors,
        -- with timestamps drifting forward from the thread.
        INSERT INTO comments_v2 (
            target_type, target_id, parent_id,
            author_id, body, depth,
            created_at, updated_at
        )
        SELECT
            'forum_thread',
            t_id::text,
            t_id,
            CASE (gs - 1) % 5
                WHEN 0 THEN u_user
                WHEN 1 THEN u_mod
                WHEN 2 THEN u_legacy
                WHEN 3 THEN u_legacy_a
                ELSE u_admin
            END,
            CASE (gs - 1) % 6
                WHEN 0 THEN 'Great point — agreed.'
                WHEN 1 THEN 'Same here, glad I''m not the '
                              'only one.'
                WHEN 2 THEN 'Could you share a bit more '
                              'detail / steps to reproduce?'
                WHEN 3 THEN 'Filed an issue for this on '
                              'GitHub, will link when up.'
                WHEN 4 THEN 'Interesting — I had the '
                              'opposite experience actually.'
                ELSE 'Thanks for posting this!'
            END,
            1,
            NOW() - ((p.age::numeric - gs * 0.4)
                     || ' days')::INTERVAL,
            NOW() - ((p.age::numeric - gs * 0.4)
                     || ' days')::INTERVAL
        FROM generate_series(1, p.replies) AS gs;

        -- Build paths for the replies we just inserted.
        UPDATE comments_v2
        SET path = text2ltree(t_id::text)
                   || text2ltree(id::text)
        WHERE parent_id = t_id
          AND path IS NULL;
    END LOOP;
END $$;
