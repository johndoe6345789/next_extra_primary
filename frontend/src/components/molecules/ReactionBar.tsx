'use client';

import React, { useState } from 'react';
import { Box } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useReactions } from '@/hooks/useReactions';
import { ReactionPicker } from './ReactionPicker';

/** Props for ReactionBar. */
export interface ReactionBarProps {
  /** Target entity type (post, comment, wiki…). */
  targetType: string;
  /** Target entity ID. */
  targetId: string;
  /** data-testid attribute. */
  testId?: string;
}

const CHIP_SX = {
  display: 'flex', alignItems: 'center', gap: 0.25,
  border: 'none', borderRadius: 4,
  px: 1, py: 0.25, cursor: 'pointer', fontSize: 14,
};

/**
 * Displays reaction emoji chips with counts and a
 * "+" button to open the picker. Reusable across
 * posts, comments, and wiki pages.
 *
 * @param props - Component props.
 */
export const ReactionBar: React.FC<ReactionBarProps> = ({
  targetType, targetId, testId = 'reaction-bar',
}) => {
  const t = useTranslations('social');
  const { reactions, toggle } = useReactions({
    targetType, targetId,
  });
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Box
      data-testid={testId}
      aria-label={t('reactions')}
      sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap',
        alignItems: 'center', position: 'relative' }}
    >
      {reactions.map((r) => (
        <Box
          key={r.emoji} component="button"
          onClick={() => void toggle(r.emoji)}
          aria-label={`${r.emoji} ${r.count}`}
          aria-pressed={r.reacted}
          data-testid={`${testId}-emoji-${r.emoji}`}
          sx={{
            ...CHIP_SX,
            background: r.reacted
              ? 'var(--m3-primary-container)'
              : 'var(--m3-surface-variant)',
          }}
        >
          {r.emoji}
          <span style={{ fontSize: 12 }}>{r.count}</span>
        </Box>
      ))}
      <Box
        component="button"
        onClick={() => setPickerOpen((v) => !v)}
        aria-label={t('addReaction')}
        aria-expanded={pickerOpen}
        data-testid={`${testId}-add`}
        sx={{
          ...CHIP_SX,
          background: 'var(--m3-surface-variant)',
        }}
      >
        +
      </Box>
      {pickerOpen && (
        <Box sx={{ position: 'absolute',
          bottom: '100%', left: 0, zIndex: 10 }}>
          <ReactionPicker
            testId={`${testId}-picker`}
            onPick={(emoji) => {
              void toggle(emoji);
              setPickerOpen(false);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ReactionBar;
