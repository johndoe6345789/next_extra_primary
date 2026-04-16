'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { IconButton } from '../atoms';
import NotificationsIcon from '@shared/icons/Notifications';
import NotificationBadge from './NotificationBadge';
import { useMentions } from '@/hooks/useMentions';
import { t as tk } from '@shared/theme/tokens';

/** Props for the MentionsBell component. */
export interface MentionsBellProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Navbar bell icon showing unread mention count.
 * Links to the /mentions page.
 *
 * @param props - Component props.
 */
export const MentionsBell: React.FC<MentionsBellProps> = ({
  testId = 'mentions-bell',
}) => {
  const t = useTranslations('social');
  const { unreadCount } = useMentions();

  const label =
    unreadCount > 0
      ? t('mentionsUnread', { count: unreadCount })
      : t('noMentions');

  return (
    <Link
      href="/mentions"
      aria-label={label}
      data-testid={testId}
      style={{ display: 'inline-flex', position: 'relative' }}
    >
      <IconButton
        icon={
          <NotificationsIcon
            size={28}
           
            style={{ color: tk.onSurface }}
          />
        }
        ariaLabel={label}
        tooltip={t('mentions')}
        testId={`${testId}-button`}
      />
      {unreadCount > 0 && (
        <NotificationBadge
          count={unreadCount}
          testId={testId}
        />
      )}
    </Link>
  );
};

export default MentionsBell;
