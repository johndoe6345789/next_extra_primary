'use client';

import { useEffect } from 'react';

/**
 * App-wide error boundary. Catches errors thrown from
 * the root layout itself (e.g. provider failures) where
 * the locale error.tsx cannot run because its parent
 * tree is what crashed. Must include <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('global error boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: '4rem 1.5rem',
          fontFamily: 'system-ui, sans-serif',
          color: '#1a1a1a',
          background: '#fafafa',
          minHeight: '100dvh',
        }}
      >
        <main
          role="alert"
          style={{ maxWidth: 640, margin: '0 auto' }}
        >
          <h1 style={{ fontSize: '1.5rem' }}>
            Something went wrong
          </h1>
          <p>
            The app failed to render.
            {error.digest && ` (ref: ${error.digest})`}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.6rem 1.2rem',
              border: 0,
              borderRadius: 4,
              background: '#1a73e8',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
