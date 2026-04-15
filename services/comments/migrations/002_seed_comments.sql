-- 005: Seed comments from seed-comments.json
-- Source: backend/src/constants/seed-comments.json
INSERT INTO comments (user_id, content, created_at)
SELECT u.id, c.content, c.ts
FROM (VALUES
    ('admin',
     'Welcome to NextExtra! Excited to have everyone here.',
     NOW() - INTERVAL '3 days'),
    ('testuser',
     'Just hit level 5, the gamification system is addictive!',
     NOW() - INTERVAL '2 days'),
    ('apidemo',
     'Anyone tried the AI chat feature yet? Pretty impressive.',
     NOW() - INTERVAL '1 day'),
    ('admin',
     'New badges dropping next week. Stay tuned!',
     NOW() - INTERVAL '12 hours'),
    ('testuser',
     'The dark mode theme is really well done.',
     NOW() - INTERVAL '6 hours'),
    ('system',
     'System maintenance completed successfully.',
     NOW() - INTERVAL '2 hours'),
    ('apidemo',
     'Loving the leaderboard competition this week!',
     NOW() - INTERVAL '30 minutes')
) AS c(uname, content, ts)
JOIN users u ON u.username = c.uname
ON CONFLICT DO NOTHING;
