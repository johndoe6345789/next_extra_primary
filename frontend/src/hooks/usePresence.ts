'use client';

import { useEffect, useRef, useState } from 'react';
import constants from '@/constants/social.json';

/** Return type for usePresence. */
export interface UsePresenceReturn {
  /** Whether the user is currently online. */
  online: boolean;
  /** ISO timestamp of last seen. */
  lastSeen?: string;
}

/**
 * Polls presence endpoint every 30s.
 * Pauses polling when the browser tab is hidden
 * to avoid unnecessary network traffic.
 *
 * @param userId - User to check presence for.
 * @returns Presence state.
 */
export function usePresence(
  userId: string,
): UsePresenceReturn {
  const [online, setOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<
    string | undefined
  >(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval>>(
    null,
  );

  useEffect(() => {
    let active = true;

    const fetchPresence = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(
          `/api/social/presence/${userId}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          online: boolean;
          lastSeen?: string;
        };
        if (active) {
          setOnline(data.online);
          setLastSeen(data.lastSeen);
        }
      } catch {
        // silently ignore network errors
      }
    };

    void fetchPresence();
    timerRef.current = setInterval(
      fetchPresence,
      constants.presence.pollIntervalMs,
    );

    const onVisibility = () => {
      if (!document.hidden) void fetchPresence();
    };
    document.addEventListener(
      'visibilitychange',
      onVisibility,
    );

    return () => {
      active = false;
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener(
        'visibilitychange',
        onVisibility,
      );
    };
  }, [userId]);

  return { online, lastSeen };
}

export default usePresence;
