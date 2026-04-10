/**
 * Style constants for the AvatarMenu dropdown.
 * @module components/organisms/avatarMenuStyles
 */
import type React from 'react';

const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/app';

/** Fallback avatar for guest / unnamed users. */
export const GUEST_AVATAR =
  `${BASE}/avatars/guest.svg`;

/** Menu panel style: responsive to viewport. */
export const menuStyle: React.CSSProperties = {
  width: 'min(320px, calc(100vw - 24px))',
};

/** Shared inline style for menu link items. */
export const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
};

/** Menu nav link definitions. */
export const menuLinks = [
  { href: '/profile', key: 'profile' },
  { href: '/settings', key: 'settings' },
] as const;

/** Resolved avatar display props. */
export interface AvatarDisplay {
  /** Display name (fallback to guest label). */
  name: string;
  /** Image source, or undefined for initial. */
  src: string | undefined;
}

/**
 * Resolves display name and avatar src from
 * user fields. Shows initial when the user has
 * a name but no avatar; guest.svg otherwise.
 */
export function resolveAvatar(
  displayName: string | undefined,
  username: string | undefined,
  avatarUrl: string | undefined,
  guestLabel: string,
): AvatarDisplay {
  const hasName = !!(displayName || username);
  return {
    name: hasName
      ? (displayName || username)! : guestLabel,
    src: avatarUrl
      || (hasName ? undefined : GUEST_AVATAR),
  };
}
