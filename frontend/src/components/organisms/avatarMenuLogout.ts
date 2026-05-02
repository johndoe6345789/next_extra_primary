/**
 * @file avatarMenuLogout.ts
 * @brief Composite logout used by AvatarMenu.
 *        Order: clear local Keycloak cookies, fire the
 *        legacy /api/auth/logout best-effort, then
 *        redirect through Keycloak's end-session URL so
 *        the IdP session is killed.
 */
import {
  COOKIE, clearCookie,
} from '@/lib/keycloakCookies';
import { logout as keycloakLogoutUrl }
  from '@/lib/keycloakClient';

/** Run the orchestrated logout flow. */
export async function runLogout(
  legacyLogout: () => Promise<void> | void,
): Promise<void> {
  // 1. Clear local Keycloak cookies first so subsequent
  //    same-tab requests do not race with the redirect.
  clearCookie(COOKIE.access);
  clearCookie(COOKIE.refresh);
  clearCookie(COOKIE.state);
  clearCookie(COOKIE.verifier);

  // 2. Best-effort legacy logout. Failures are swallowed
  //    because the IdP redirect below is what actually
  //    ends the user's session.
  try {
    await legacyLogout();
  } catch {
    /* noop — best-effort */
  }

  // 3. Bounce through Keycloak's logout endpoint to kill
  //    the IdP session and land on /app/en/login.
  if (typeof window !== 'undefined') {
    window.location.href = keycloakLogoutUrl();
  }
}
