'use client';

import { type ReactElement } from 'react';
import { t } from '@shared/theme/tokens';

/** Single locale bar colour based on %. */
function barColor(pct: number): string {
  if (pct >= 100) return t.primary;
  if (pct >= 80) return '#f59e0b';
  return '#ef4444';
}

/** Props for a single coverage bar. */
export interface CoverageBarProps {
  /** Locale code (e.g. "en"). */
  locale: string;
  /** Keys present count. */
  present: number;
  /** Total keys count. */
  total: number;
}

/**
 * Single locale coverage bar showing a
 * percentage-filled progress indicator.
 *
 * @param props - Locale coverage data.
 * @returns A coverage bar element.
 */
export default function CoverageBar({
  locale, present, total,
}: CoverageBarProps): ReactElement {
  const pct = total > 0
    ? Math.round((present / total) * 100)
    : 0;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        gap: 8, marginBottom: 4,
      }}
      data-testid={`cov-${locale}`}
    >
      <span style={{
        width: 28, fontWeight: 600, fontSize: 13,
      }}>
        {locale.toUpperCase()}
      </span>
      <div style={{
        flex: 1, height: 14, borderRadius: 7,
        background: t.surfaceVariant,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          borderRadius: 7,
          background: barColor(pct),
          transition: 'width 0.3s',
        }} />
      </div>
      <span style={{
        width: 70, fontSize: 12,
        textAlign: 'right',
      }}>
        {present}/{total} ({pct}%)
      </span>
    </div>
  );
}
