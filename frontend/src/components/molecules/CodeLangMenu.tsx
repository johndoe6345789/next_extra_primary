'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@shared/m3';
import LANGUAGES
  from '@/constants/markdown-code-languages.json';
import s from './CodeLangMenu.module.scss';

/** Props for CodeLangMenu. */
export interface CodeLangMenuProps {
  /** Element the menu is anchored under. */
  anchor: HTMLElement;
  /** Called when the user picks a language; pass
   *  the empty string for "plain" / no language. */
  onPick: (value: string) => void;
  /** Called when the menu should close (Esc click,
   *  outside click, or after a pick). */
  onClose: () => void;
}

/** Popover menu listing the supported fenced-code
 *  languages. Positions itself under the anchor
 *  button and closes on outside click / Esc. */
export function CodeLangMenu({
  anchor, onPick, onClose,
}: CodeLangMenuProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const rect = anchor.getBoundingClientRect();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (
        ref.current
        && t
        && !ref.current.contains(t)
        && !anchor.contains(t)
      ) {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener(
        'mousedown', onDown,
      );
    };
  }, [anchor, onClose]);

  return (
    <Box
      ref={ref as React.Ref<HTMLDivElement>}
      className={s.menu}
      role="menu"
      aria-label="Code language"
      data-testid="code-lang-menu"
      style={{
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
      }}
    >
      {LANGUAGES.map((l) => (
        <button
          key={l.value || 'plain'}
          type="button"
          role="menuitem"
          className={s.item}
          onClick={() => {
            onPick(l.value);
            onClose();
          }}
          data-testid={
            `code-lang-${l.value || 'plain'}`
          }
        >
          {l.label}
          {l.value && (
            <span className={s.value}>{l.value}</span>
          )}
        </button>
      ))}
    </Box>
  );
}

export default CodeLangMenu;
