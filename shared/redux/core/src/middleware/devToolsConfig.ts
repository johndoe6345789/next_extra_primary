/**
 * Redux DevTools configuration and helpers
 */

/** Redux DevTools configuration */
export const devToolsConfig = {
  trace: process.env.NODE_ENV === 'development',
  traceLimit: 25,
  actionSanitizer: (
    action: { type: string }
  ) => ({ ...action, type: action.type }),
  stateSanitizer: (state: unknown) => state,
  maxAge:
    process.env.NODE_ENV === 'development'
      ? 100 : 10,
};

/** Redux DevTools window type */
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
      config: unknown
    ) => (reducer: unknown) => unknown;
    __REDUX_DEVTOOLS_EXTENSION__?: (
      config: unknown
    ) => (next: unknown) => unknown;
  }
}

/** Get DevTools config for configureStore */
export function getDevToolsConfig() {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  return devToolsConfig as
    Record<string, unknown>;
}

/** Enable Redux DevTools extension */
export function enableReduxDevTools() {
  if (typeof window === 'undefined') return;
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.info(
      'Redux DevTools extension detected'
    );
  }
}
