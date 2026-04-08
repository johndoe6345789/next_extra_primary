'use client';
/**
 * Table displaying translation rows with header.
 * @module components/organisms/TranslationTable
 */
import { type ReactElement } from 'react';
import { Box } from '@shared/m3';
import TranslationRow from
  '@/components/molecules/TranslationRow';

/** Shape of a single translation entry. */
export interface TranslationEntry {
  /** Translation namespace. */
  ns: string;
  /** Dot-notation key. */
  key: string;
  /** Current value. */
  value: string;
}

/** Props for TranslationTable. */
export interface TranslationTableProps {
  /** Translation rows to display. */
  rows: TranslationEntry[];
  /** Save handler for inline edits. */
  save: (
    ns: string, key: string, value: string,
  ) => Promise<void>;
}

/** Shared header cell style. */
const th = { textAlign: 'left' as const, padding: 8 };

/**
 * Renders the translation entries table.
 *
 * @param props - Table props.
 * @returns Table element.
 */
export default function TranslationTable({
  rows, save,
}: TranslationTableProps): ReactElement {
  return (
    <Box
      component="table"
      style={{
        width: '100%',
        borderCollapse: 'collapse',
      }}
      aria-label="Translation entries"
      data-testid="translation-table"
    >
      <thead>
        <tr>
          <th style={th}>Namespace</th>
          <th style={th}>Key</th>
          <th style={th}>Value</th>
          <th style={{ padding: 8 }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <TranslationRow
            key={`${r.ns}.${r.key}`}
            ns={r.ns}
            tKey={r.key}
            value={r.value}
            onSave={save}
          />
        ))}
      </tbody>
    </Box>
  );
}
