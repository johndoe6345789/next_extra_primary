# PWA — Mobile install and offline shell (Phase 8.5)

Nextra's main `frontend/` app and each tool (SSO,
Email, Jobs, Cron, Alerts) ship a web app manifest
and an SVG icon so they can be installed to the
home screen on iOS and Android. The main app also
registers a service worker for offline shell + SWR.

## Files

- `frontend/public/manifest.webmanifest` — main app
- `frontend/public/icon.svg` — rounded "N" glyph
- `frontend/public/sw.js` — service worker
- `frontend/src/components/atoms/PwaRegister.tsx`
  — registers SW + install prompt (M3 Snackbar)
- `frontend/src/app/[locale]/pwa-head.tsx` — head tags
- `tools/<name>/public/manifest.webmanifest` — tools
- `tools/<name>/public/icon.svg` — tool glyphs

## Install on iOS (Safari)

1. Open `http://localhost:8889/app/en` in Safari.
2. Tap Share → Add to Home Screen.
3. Name it "Nextra" and tap Add.

Note: iOS ignores `beforeinstallprompt`, so no in-app
snackbar appears. The manifest, theme-color and
`apple-touch-icon` tags make the shortcut look right.

## Install on Android (Chrome / Edge)

1. Open the portal URL in Chrome.
2. Tap the three-dot menu → Install app.
3. Or wait for the in-app "Install Nextra as an app?"
   Snackbar — tap Install.

## Testing the service worker

- DevTools → Application → Service Workers to inspect
  and `Unregister` for a clean state.
- Go offline in DevTools Network tab — the app shell
  (`/app/en`, manifest, icon) still loads from cache.
- `/api/*` is network-only; it will fail offline.

## Regenerating icons

Icons are plain SVG with a `viewBox` of `0 0 512 512`,
referenced directly from the manifest. To rebrand,
edit `public/icon.svg` — no build step. Android and
iOS both accept SVG from recent versions; a PNG fallback
can be added later if older devices are in scope.
