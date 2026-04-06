/**
 * Global setup for the frontend-ui test package.
 *
 * Starts the services declared in
 * shared/packages/frontend-ui/package.json via Testcontainers.
 */
import { startPackageServices } from './package-setup.js';

async function globalSetup() {
  const teardown = await startPackageServices('frontend-ui');
  (globalThis as Record<string, unknown>)
    .__FRONTEND_UI_TEARDOWN__ = teardown;
}

export default globalSetup;
