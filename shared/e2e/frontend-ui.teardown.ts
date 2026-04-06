/**
 * Global teardown for the frontend-ui test package.
 *
 * Calls the teardown function stored by frontend-ui.setup.ts.
 */
async function globalTeardown() {
  const teardown = (globalThis as Record<string, unknown>)
    .__FRONTEND_UI_TEARDOWN__;
  if (typeof teardown === 'function') {
    await (teardown as () => Promise<void>)();
  }
}

export default globalTeardown;
