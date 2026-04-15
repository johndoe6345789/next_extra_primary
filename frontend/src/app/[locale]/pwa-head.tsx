/**
 * pwa-head — PWA-related <head> link/meta tags.
 *
 * Additive wiring (one-line import) in
 * `frontend/src/app/[locale]/layout.tsx`:
 *   import { PwaHead } from './pwa-head';
 *   ...and render {<PwaHead />} near HtmlLang.
 *
 * Safe to render inside the body — Next.js will
 * hoist link/meta tags into <head>.
 */
import type { ReactElement } from 'react';

/** Theme color matches M3 primary token. */
const THEME_COLOR = '#6750A4';

/** Manifest path under nginx /app prefix. */
const MANIFEST_HREF = '/app/manifest.webmanifest';

/** Apple touch icon path. */
const APPLE_ICON_HREF = '/app/icon.svg';

/**
 * Returns PWA manifest + theme-color + apple-touch
 * icon link/meta fragments for the locale layout.
 *
 * @returns React fragment of head tags.
 */
export function PwaHead(): ReactElement {
  return (
    <>
      <link
        rel="manifest"
        href={MANIFEST_HREF}
      />
      <meta
        name="theme-color"
        content={THEME_COLOR}
      />
      <link
        rel="apple-touch-icon"
        href={APPLE_ICON_HREF}
      />
      <meta
        name="apple-mobile-web-app-capable"
        content="yes"
      />
      <meta
        name="apple-mobile-web-app-title"
        content="Nextra"
      />
      <meta
        name="mobile-web-app-capable"
        content="yes"
      />
    </>
  );
}

export default PwaHead;
