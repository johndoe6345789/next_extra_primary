import { useEffect } from 'react';

/** Hooks the document Escape key to cancel a dialog.
 *  The dialogs share this — extracting it keeps each
 *  dialog component under the 100-line cap. */
export function useEscToCancel(
  onCancel: () => void,
): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', onKey);
    return () =>
      document.removeEventListener('keydown', onKey);
  }, [onCancel]);
}
