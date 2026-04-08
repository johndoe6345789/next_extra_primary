'use client';
/**
 * Action buttons for the translation row
 * (edit / save / cancel).
 *
 * @module components/molecules/TranslationRowActions
 */
import { type ReactElement } from 'react';
import { Button } from '@shared/m3';
import { useTranslations } from 'next-intl';

/** Props for TranslationRowActions. */
export interface TranslationRowActionsProps {
  /** Whether the row is in edit mode. */
  editing: boolean;
  /** Whether a save is in progress. */
  saving: boolean;
  /** Namespace for aria labels. */
  ns: string;
  /** Translation key for aria labels. */
  tKey: string;
  /** Enter edit mode. */
  onEdit: () => void;
  /** Save handler. */
  onSave: () => void;
  /** Cancel handler. */
  onCancel: () => void;
}

/**
 * Renders edit/save/cancel buttons for a
 * translation table row.
 *
 * @param props - Action props.
 * @returns Button group element.
 */
export default function TranslationRowActions({
  editing, saving, ns, tKey,
  onEdit, onSave, onCancel,
}: TranslationRowActionsProps): ReactElement {
  const t = useTranslations('common');

  if (!editing) {
    return (
      <Button
        size="small"
        onClick={onEdit}
        data-testid={`edit-btn-${ns}-${tKey}`}
        aria-label={`Edit ${ns}.${tKey}`}
      >
        {t('edit')}
      </Button>
    );
  }

  return (
    <>
      <Button
        size="small"
        onClick={onSave}
        disabled={saving}
        data-testid={`save-${ns}-${tKey}`}
        aria-label={`Save ${ns}.${tKey}`}
      >
        {saving ? '...' : t('save')}
      </Button>
      <Button
        size="small"
        onClick={onCancel}
        aria-label={t('cancel')}
      >
        {t('cancel')}
      </Button>
    </>
  );
}
