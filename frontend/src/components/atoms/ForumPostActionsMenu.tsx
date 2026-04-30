'use client';

/**
 * Extracted actions menu for a forum post.
 * Renders edit/ban options based on permission flags.
 * @module components/atoms/ForumPostActionsMenu
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Menu, MenuItem,
} from '@shared/m3/navigation/Menu';

/** Props for ForumPostActionsMenu. */
export interface ForumPostActionsMenuProps {
  /** Whether the menu is open. */
  open: boolean;
  /** Button element the menu is anchored to. */
  anchorEl: HTMLButtonElement | null;
  /** Close the menu. */
  onClose(): void;
  /** Current user is the post author. */
  isSelf: boolean;
  /** Current user can ban others. */
  canBan: boolean;
  /** Display name of the post author. */
  authorName: string;
  /** Invoked when user clicks "Edit post". */
  onEdit?(): void;
  /** Invoked when user clicks "Ban [name]". */
  onBan?(): void;
}

/**
 * Dropdown menu with edit and ban actions for a forum post.
 * Items are conditionally shown based on isSelf / canBan.
 *
 * @param props - Menu visibility, permissions, callbacks.
 * @returns Rendered Menu with conditional MenuItems.
 */
export function ForumPostActionsMenu({
  open, anchorEl, onClose,
  isSelf, canBan, authorName,
  onEdit, onBan,
}: ForumPostActionsMenuProps): React.ReactElement {
  const t = useTranslations('forum');

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorRight
      testId="post-actions-menu"
    >
      {isSelf && (
        <MenuItem
          onClick={() => { onClose(); onEdit?.(); }}
          data-testid="post-action-edit"
        >
          {t('editPost')}
        </MenuItem>
      )}
      {canBan && !isSelf && (
        <MenuItem
          onClick={() => { onClose(); onBan?.(); }}
          data-testid="post-action-ban"
        >
          {t('banUser', { name: authorName })}
        </MenuItem>
      )}
    </Menu>
  );
}

export default ForumPostActionsMenu;
