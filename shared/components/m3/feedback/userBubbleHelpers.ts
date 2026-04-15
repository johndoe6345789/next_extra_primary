/** Helpers for UserBubble. */

export interface UserShape {
  username?: string
  displayName?: string
  email?: string
}

/** Read user JSON from localStorage. */
export function readUser(): UserShape | null {
  if (typeof window === 'undefined') return null
  try {
    const raw =
      window.localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw) as UserShape
  } catch { return null }
}

/** Clear common auth keys + bounce to SSO. */
export function defaultLogout(): void {
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('token')
  window.location.href = '/sso/login'
}

/** Single-letter avatar text from a user. */
export function initials(
  u: UserShape | null,
): string {
  const n = u?.displayName ?? u?.username ?? '?'
  return n.slice(0, 1).toUpperCase()
}

/** Display label for a user. */
export function userLabel(
  u: UserShape | null,
): string {
  return (
    u?.displayName ?? u?.username ?? 'Guest'
  )
}
