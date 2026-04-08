'use client';

import {
  useState, useCallback, useEffect,
} from 'react';

/**
 * State and keyboard handling for ComposeWindow.
 * @param onClose - Close callback.
 * @returns State values and handlers.
 */
export function useComposeWindow(
  onClose?: () => void
) {
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCcBcc, setShowCcBcc] =
    useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener(
      'keydown', handleKeyDown
    );
    return () =>
      document.removeEventListener(
        'keydown', handleKeyDown
      );
  }, [handleKeyDown]);

  return {
    to, setTo,
    cc, setCc,
    bcc, setBcc,
    subject, setSubject,
    body, setBody,
    showCcBcc, setShowCcBcc,
  };
}
