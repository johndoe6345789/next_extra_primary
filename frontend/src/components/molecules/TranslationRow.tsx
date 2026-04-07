'use client';
/**
 * Single editable row in the translation table.
 *
 * @module components/molecules/TranslationRow
 */
import {
  type ReactElement, useState, useCallback,
} from 'react';
import { Button } from '@shared/m3';
import { useTranslations } from 'next-intl';

/** Props for TranslationRow. */
interface TranslationRowProps {
  /** Translation namespace. */
  readonly ns: string;
  /** Dot-notation key within the namespace. */
  readonly tKey: string;
  /** Current translation value. */
  readonly value: string;
  /** Called when user saves an edit. */
  readonly onSave: (
    ns: string, key: string, value: string,
  ) => Promise<void>;
}

/**
 * Renders a table row with inline value editing.
 *
 * @param props - Row props.
 * @returns Table row element.
 */
export default function TranslationRow({
  ns, tKey, value, onSave,
}: TranslationRowProps): ReactElement {
  const t = useTranslations('common');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    await onSave(ns, tKey, draft);
    setSaving(false);
    setEditing(false);
  }, [ns, tKey, draft, onSave]);

  const cell = { padding: 8, borderBottom: '1px solid #e0e0e0' };

  return (
    <tr data-testid={`row-${ns}-${tKey}`}>
      <td style={cell}>{ns}</td>
      <td style={cell}>{tKey}</td>
      <td style={cell}>
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`Edit ${ns}.${tKey}`}
            data-testid={`edit-${ns}-${tKey}`}
            style={{ width: '100%', padding: 4 }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            title="Double-click to edit"
          >
            {value}
          </span>
        )}
      </td>
      <td style={{ ...cell, textAlign: 'center' }}>
        {editing ? (
          <>
            <Button
              size="small"
              onClick={handleSave}
              disabled={saving}
              data-testid={`save-${ns}-${tKey}`}
              aria-label={`Save ${ns}.${tKey}`}
            >
              {saving ? '...' : t('save')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                setDraft(value);
                setEditing(false);
              }}
              aria-label={t('cancel')}
            >
              {t('cancel')}
            </Button>
          </>
        ) : (
          <Button
            size="small"
            onClick={() => setEditing(true)}
            data-testid={`edit-btn-${ns}-${tKey}`}
            aria-label={`Edit ${ns}.${tKey}`}
          >
            {t('edit')}
          </Button>
        )}
      </td>
    </tr>
  );
}
