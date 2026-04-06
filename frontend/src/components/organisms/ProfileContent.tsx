'use client';

import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import ProfileHeader from './ProfileHeader';
import ProfileBadges from './ProfileBadges';
import ProfileActivity from './ProfileActivity';

/**
 * Client-side profile page content. Composes
 * the header, badges, and activity sections.
 */
export default function ProfileContent() {
  return (
    <div style={stackStyle}>
      <Card>
        <CardContent>
          <ProfileHeader />
        </CardContent>
      </Card>
      <ProfileBadges />
      <ProfileActivity />
    </div>
  );
}

const stackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};
