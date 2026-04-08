'use client';
/**
 * Single editable row in the translation table.
 * @module components/molecules/TranslationRow
 */
import {
  type ReactElement, useState, useCallback,
} from 'react';
import TranslationRowActions from
  './TranslationRowActions';
import type { TranslationRowProps } from
  './translationRowTypes';
import {
  cellStyle, editInputStyle,
} from './translationRowTypes';

export type { TranslationRowProps } from
  './translationRowTypes';

/**
 * Renders a table row with inline editing.
 * @param props - Row props.
 * @returns Table row element.
 */
export default function TranslationRow({
  ns, tKey, value, onSave,
}: TranslationRowProps): ReactElement {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    await onSave(ns, tKey, draft);
    setSaving(false);
    setEditing(false);
  }, [ns, tKey, draft, onSave]);

  return (
    <tr data-testid={`row-${ns}-${tKey}`}>
      <td style={cellStyle}>{ns}</td>
      <td style={cellStyle}>{tKey}</td>
      <td style={cellStyle}>
        {editing ? (
          <input
            value={draft}
            onChange={(e) =>
              setDraft(e.target.value)}
            aria-label={`Edit ${ns}.${tKey}`}
            data-testid={
              `edit-${ns}-${tKey}`
            }
            style={editInputStyle}
          />
        ) : (
          <span
            onDoubleClick={() =>
              setEditing(true)}
            title="Double-click to edit"
          >
            {value}
          </span>
        )}
      </td>
      <td style={{
        ...cellStyle, textAlign: 'center',
      }}>
        <TranslationRowActions
          editing={editing} saving={saving}
          ns={ns} tKey={tKey}
          onEdit={() => setEditing(true)}
          onSave={handleSave}
          onCancel={() => {
            setDraft(value);
            setEditing(false);
          }}
        />
      </td>
    </tr>
  );
}
