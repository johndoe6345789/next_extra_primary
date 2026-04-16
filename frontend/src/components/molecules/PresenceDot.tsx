'use client';

import React from 'react';
import { usePresence } from '@/hooks/usePresence';

/** Props for the PresenceDot component. */
export interface PresenceDotProps {
  /** User ID to check presence for. */
  userId: string;
  /** data-testid attribute. */
  testId?: string;
}

const DOT_BASE: React.CSSProperties = {
  display: 'inline-block',
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: '2px solid white',
  flexShrink: 0,
};

/**
 * A small coloured dot reflecting user presence.
 * Green = online, grey = offline.
 * Polls the presence endpoint every 30 s and
 * pauses when the tab is hidden.
 *
 * @param props - Component props.
 */
export const PresenceDot: React.FC<PresenceDotProps> = ({
  userId,
  testId = 'presence-dot',
}) => {
  const { online } = usePresence(userId);

  return (
    <span
      data-testid={testId}
      aria-label={online ? 'Online' : 'Offline'}
      title={online ? 'Online' : 'Offline'}
      style={{
        ...DOT_BASE,
        background: online ? '#22c55e' : '#9ca3af',
      }}
    />
  );
};

export default PresenceDot;
