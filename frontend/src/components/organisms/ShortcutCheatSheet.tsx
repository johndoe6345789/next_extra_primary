'use client';

import React from 'react';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from
  '@shared/m3/DialogContent';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { Kbd } from '../atoms/Kbd';
import { shortcutLabel } from
  '@/lib/shortcutLabel';
import {
  SECTION_KEYS, type SectionKey,
} from './shortcutCheatSheetConfig';

/** Props for the ShortcutCheatSheet dialog. */
export interface ShortcutCheatSheetProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog should close. */
  onClose: () => void;
}

/**
 * A dialog listing all keyboard shortcuts
 * grouped by category. Triggered by `?`.
 *
 * @param props - Component props.
 * @returns The cheat sheet dialog element.
 */
export const ShortcutCheatSheet: React.FC<
  ShortcutCheatSheetProps
> = ({ open, onClose }) => {
  const tn = useTranslations('nav');
  const labels: Record<SectionKey, string> = {
    global: 'Global',
    chat: tn('chat'),
    navigation: 'Navigation',
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      data-testid="shortcut-cheat-sheet"
      aria-label="Keyboard shortcuts"
    >
      <DialogTitle>
        Keyboard Shortcuts
      </DialogTitle>
      <DialogContent dividers>
        {SECTION_KEYS.map(({ key, data }) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
            >
              {labels[key]}
            </Typography>
            {Object.values(data).map((def) => (
              <Box
                key={def.description}
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  py: 0.5,
                }}
              >
                <Typography variant="body2">
                  {def.description}
                </Typography>
                <Kbd
                  combo={shortcutLabel(def)}
                />
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutCheatSheet;
