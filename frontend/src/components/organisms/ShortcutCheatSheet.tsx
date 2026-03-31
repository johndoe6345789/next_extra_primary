'use client';

import React from 'react';
import Dialog from '@metabuilder/m3/Dialog';
import DialogTitle from '@metabuilder/m3/DialogTitle';
import DialogContent from '@metabuilder/m3/DialogContent';
import Box from '@metabuilder/m3/Box';
import Typography from '@metabuilder/m3/Typography';
import { Kbd } from '../atoms/Kbd';
import shortcuts from '@/constants/keyboard-shortcuts.json';
import { shortcutLabel, type ShortcutDef } from '@/lib/shortcutLabel';

/** Props for the ShortcutCheatSheet dialog. */
export interface ShortcutCheatSheetProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog should close. */
  onClose: () => void;
}

type Section = Record<string, ShortcutDef>;

const SECTIONS: { title: string; data: Section }[] = [
  { title: 'Global', data: shortcuts.global as Section },
  { title: 'Chat', data: shortcuts.chat as Section },
  {
    title: 'Navigation',
    data: shortcuts.navigation as Section,
  },
];

/**
 * A dialog listing all keyboard shortcuts grouped
 * by category. Triggered by pressing `?`.
 *
 * @param props - Component props.
 * @returns The cheat sheet dialog element.
 */
export const ShortcutCheatSheet: React.FC<ShortcutCheatSheetProps> = ({
  open,
  onClose,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    data-testid="shortcut-cheat-sheet"
    aria-label="Keyboard shortcuts"
  >
    <DialogTitle>Keyboard Shortcuts</DialogTitle>
    <DialogContent dividers>
      {SECTIONS.map(({ title, data }) => (
        <Box key={title} sx={{ mb: 2 }}>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          {Object.values(data).map((def) => (
            <Box
              key={def.description}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 0.5,
              }}
            >
              <Typography variant="body2">{def.description}</Typography>
              <Kbd combo={shortcutLabel(def)} />
            </Box>
          ))}
        </Box>
      ))}
    </DialogContent>
  </Dialog>
);

export default ShortcutCheatSheet;
