/**
 * Types and styles for the TranslationRow
 * molecule.
 * @module components/molecules/translationRowTypes
 */
import type { CSSProperties } from 'react';

/** Props for TranslationRow. */
export interface TranslationRowProps {
  /** Translation namespace. */
  readonly ns: string;
  /** Dot-notation key within namespace. */
  readonly tKey: string;
  /** Current translation value. */
  readonly value: string;
  /** Called when user saves an edit. */
  readonly onSave: (
    ns: string, key: string, value: string,
  ) => Promise<void>;
}

/** Shared table cell style. */
export const cellStyle: CSSProperties = {
  padding: 8,
  borderBottom: '1px solid #e0e0e0',
};

/** Inline edit input style. */
export const editInputStyle: CSSProperties = {
  width: '100%',
  padding: 4,
};
