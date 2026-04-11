/**
 * Types for the UserRow organism.
 * @module components/organisms/userRowTypes
 */
import type { CSSProperties } from 'react';
import { t as tk } from '@shared/theme/tokens';
import type { useTranslations } from 'next-intl';

/** Shape of a user record for display. */
export interface UserRecord {
  /** Unique user identifier. */
  id: string;
  /** User email address. */
  email: string;
  /** Login username. */
  username: string;
  /** User role. */
  role: string;
  /** Whether the account is active. */
  isActive: boolean;
  /** ISO date the user was created. */
  createdAt: string;
}

/** Props for UserRow. */
export interface UserRowProps {
  /** User data to display. */
  user: UserRecord;
  /** Role change handler. */
  onRoleChange: (role: string) => void;
  /** Toggle active handler. */
  onToggleActive: () => void;
  /** Translation function. */
  t: ReturnType<typeof useTranslations>;
}

/** Row container style. */
export const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  padding: '10px 16px',
  borderRadius: 12,
  background: tk.surfaceContainer,
  marginBottom: 8,
};

/** Wrapper div constraining the role selector. */
export const selectStyle: CSSProperties = {
  width: 140,
  flexShrink: 0,
};

/** Fixed width for the action button. */
export const buttonStyle: CSSProperties = {
  flexShrink: 0,
  minWidth: 80,
};

