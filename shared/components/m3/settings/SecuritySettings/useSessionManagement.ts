'use client';

import { useState, useCallback } from 'react';

interface Session {
  id: string;
  device: string;
  lastActive: string;
  isCurrent: boolean;
}

/**
 * State and handlers for session management.
 * @param onCleared - Callback after clearing.
 * @returns Session state and actions.
 */
export function useSessionManagement(
  onCleared?: () => void
) {
  const [sessions, setSessions] = useState<
    Session[]
  >([
    {
      id: '1', device: 'Chrome on Windows',
      lastActive: '2 minutes ago',
      isCurrent: true,
    },
    {
      id: '2', device: 'Safari on MacOS',
      lastActive: '1 hour ago',
      isCurrent: false,
    },
    {
      id: '3', device: 'Firefox on Linux',
      lastActive: '3 days ago',
      isCurrent: false,
    },
  ]);
  const [isClearing, setIsClearing] =
    useState(false);

  const handleSignOutSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) =>
        prev.filter((s) => s.id !== sessionId)
      );
    }, []
  );

  const handleSignOutAll =
    useCallback(async () => {
      if (!confirm(
        'Sign out of all other sessions?'
      )) return;
      setIsClearing(true);
      try {
        await new Promise((r) =>
          setTimeout(r, 1200));
        setSessions((prev) =>
          prev.filter((s) => s.isCurrent));
        onCleared?.();
      } catch {
        alert('Failed to sign out sessions.');
      } finally { setIsClearing(false); }
    }, [onCleared]);

  const otherCount = sessions.filter(
    (s) => !s.isCurrent
  ).length;

  return {
    sessions, isClearing, otherCount,
    handleSignOutSession, handleSignOutAll,
  };
}
