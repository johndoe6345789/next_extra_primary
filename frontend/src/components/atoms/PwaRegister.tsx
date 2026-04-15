'use client';
/**
 * PwaRegister — registers the service worker and
 * presents an M3 Snackbar offering PWA install.
 *
 * Wiring (additive, one-line) in
 * `frontend/src/app/[locale]/layout.tsx`:
 *   import { PwaRegister }
 *     from '@/components/atoms/PwaRegister';
 *   ...and render <PwaRegister /> inside AppShell.
 */
import {
  useEffect,
  useState,
  type ReactElement,
} from 'react';
import { Snackbar } from '@shared/m3';

/** BeforeInstallPromptEvent minimal shape. */
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

/** Service worker URL (public root). */
const SW_URL = '/app/sw.js';

/**
 * Mount-once component: registers SW and shows a
 * Snackbar with an Install action when the browser
 * fires `beforeinstallprompt`.
 *
 * @returns Snackbar element or null.
 */
export default function PwaRegister(): ReactElement {
  const [evt, setEvt] = useState<InstallEvent | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(SW_URL)
        .catch(() => undefined);
    }
    const onPrompt = (e: Event): void => {
      e.preventDefault();
      setEvt(e as InstallEvent);
      setOpen(true);
    };
    window.addEventListener(
      'beforeinstallprompt', onPrompt,
    );
    return () => {
      window.removeEventListener(
        'beforeinstallprompt', onPrompt,
      );
    };
  }, []);

  const install = async (): Promise<void> => {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice;
    setEvt(null);
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={8000}
      message="Install Nextra as an app?"
      action={
        <button
          type="button"
          data-testid="pwa-install-btn"
          aria-label="Install Nextra app"
          onClick={install}>
          Install
        </button>
      }
      testId="pwa-install-snackbar"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    />
  );
}

export { PwaRegister };
