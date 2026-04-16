'use client';

import React from 'react';
import { Box } from '@shared/m3';
import constants from '@/constants/social.json';

/** Props for ReactionPicker. */
export interface ReactionPickerProps {
  /** Called with the chosen emoji. */
  onPick: (emoji: string) => void;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Inline emoji picker for adding reactions.
 * Displays the configured default emoji set.
 *
 * @param props - Component props.
 */
export const ReactionPicker: React.FC<
  ReactionPickerProps
> = ({ onPick, testId = 'reaction-picker' }) => (
  <Box
    data-testid={testId}
    aria-label="Pick a reaction"
    role="listbox"
    sx={{
      display: 'flex',
      gap: 0.5,
      p: 1,
      background: 'var(--m3-surface)',
      borderRadius: 2,
      boxShadow: 2,
    }}
  >
    {constants.reactions.defaultEmojis.map((emoji) => (
      <Box
        key={emoji}
        component="button"
        aria-label={`React with ${emoji}`}
        role="option"
        onClick={() => onPick(emoji)}
        data-testid={`${testId}-emoji-${emoji}`}
        sx={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          borderRadius: 1,
          p: 0.25,
          '&:hover': {
            background: 'var(--m3-surface-variant)',
          },
        }}
      >
        {emoji}
      </Box>
    ))}
  </Box>
);

export default ReactionPicker;
