'use client';

import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import { Icon } from '@shared/m3/data-display/Icon';
import { useGamification } from '@/hooks';

/**
 * Badge showcase grid for the profile page.
 * Shows all badges with earned/locked state.
 */
export default function ProfileBadges() {
  const { badges } = useGamification();
  const earned = badges.filter((b) => b.earnedAt);

  return (
    <Card data-testid="profile-badges">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Badges ({earned.length}/{badges.length})
        </Typography>
        {badges.length === 0 ? (
          <Typography variant="body2"
            color="textSecondary"
          >
            No badges available yet.
          </Typography>
        ) : (
          <div style={gridStyle}>
            {badges.map((b) => (
              <Box key={b.id}
                data-testid={`profile-badge-${b.id}`}
                sx={{
                  textAlign: 'center',
                  opacity: b.earnedAt ? 1 : 0.35,
                  p: 1.5,
                }}
              >
                <Icon
                  size="xl"
                  color={b.earnedAt
                    ? 'primary' : 'onSurfaceVariant'
                  }
                >
                  {b.iconUrl || 'emoji_events'}
                </Icon>
                <Typography variant="body2"
                  sx={{ mt: 0.5 }}
                >
                  {b.name}
                </Typography>
                <Typography variant="caption"
                  color="textSecondary"
                >
                  {b.earnedAt
                    ? new Date(b.earnedAt)
                      .toLocaleDateString()
                    : 'Locked'}
                </Typography>
              </Box>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fill, minmax(100px, 1fr))',
  gap: 8,
};
