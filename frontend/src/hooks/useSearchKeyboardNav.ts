/**
 * useSearchKeyboardNav — keyboard handler for the
 * navbar SearchBar autocomplete: ArrowUp/Down moves
 * the active suggestion, Enter picks it (or submits
 * on the "view all" footer), Escape clears and
 * closes the dropdown.
 *
 * @module hooks/useSearchKeyboardNav
 */
'use client';

import { useCallback } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import type { SearchSuggestItem } from '@/types/search';

/** Args for the hook. */
export interface SearchKbdArgs {
  suggest: SearchSuggestItem[];
  active: number;
  setActive: (
    fn: (i: number) => number,
  ) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
  submit: () => void;
  onPick: (it: SearchSuggestItem) => void;
}

/**
 * Build an onKeyDown handler for the search bar.
 *
 * @param args - Suggestions, active index, callbacks.
 * @returns A `KeyboardEventHandler`-shaped callback.
 */
export function useSearchKeyboardNav(
  args: SearchKbdArgs,
): (e: ReactKeyboardEvent) => void {
  const {
    suggest, active, setActive,
    setOpen, clear, submit, onPick,
  } = args;
  return useCallback((e: ReactKeyboardEvent) => {
    const max = suggest.length;
    if (e.key === 'Escape') {
      clear(); setOpen(false); return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, max));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const sel = suggest[active];
      if (active < max && sel) onPick(sel);
      else { submit(); setOpen(false); }
    }
  }, [suggest, active, setActive,
    setOpen, clear, submit, onPick]);
}

export default useSearchKeyboardNav;
