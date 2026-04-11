import { useEffect } from 'react';

/**
 * Locks body scroll while active. Preserves
 * the current scroll position and restores it
 * on cleanup.
 *
 * @param locked - Whether scroll should be
 *   locked.
 */
export function useScrollLock(
  locked: boolean,
): void {
  useEffect(() => {
    if (!locked) return;
    const y = window.scrollY;
    const { body } = document;
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      window.scrollTo(0, y);
    };
  }, [locked]);
}
