import { useCallback, useEffect } from 'react';

/**
 * Calls handler when Escape key is pressed.
 *
 * @param active - Only listen when true.
 * @param handler - Callback to invoke.
 */
export function useEscapeKey(
  active: boolean,
  handler: () => void,
): void {
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    },
    [handler],
  );

  useEffect(() => {
    if (active) {
      document.addEventListener(
        'keydown', onKey,
      );
    }
    return () => {
      document.removeEventListener(
        'keydown', onKey,
      );
    };
  }, [active, onKey]);
}

export default useEscapeKey;
