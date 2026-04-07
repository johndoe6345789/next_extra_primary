'use client';
/**
 * Admin translation editor.
 *
 * Shows a filterable table of translation keys
 * with inline editing and save functionality.
 */
import { type ReactElement } from 'react';
import {
  Box, Select, NativeSelect, Typography,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useTranslationAdmin } from
  '@/hooks/useTranslationAdmin';
import TranslationRow from
  '@/components/molecules/TranslationRow';
import CoverageMeter from
  '@/components/molecules/CoverageMeter';

/**
 * Admin UI for viewing and editing translations.
 *
 * @returns Translation editor component.
 */
export default function TranslationEditor(
): ReactElement {
  const t = useTranslations('common');
  const ts = useTranslations('settings');
  const {
    locale, setLocale, locales,
    filter, setFilter, namespaces,
    rows, isLoading, save,
  } = useTranslationAdmin();

  return (
    <Box data-testid="translation-editor">
      <CoverageMeter />
      <Box
        style={{
          display: 'flex', gap: 16,
          marginBottom: 16, flexWrap: 'wrap',
        }}
      >
        <label>
          {ts('language')}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            aria-label="Select locale"
            data-testid="locale-select"
            style={{ marginLeft: 8, padding: 4 }}
          >
            {locales.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <label>
          Namespace
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter namespace"
            data-testid="ns-filter"
            style={{ marginLeft: 8, padding: 4 }}
          >
            <option value="">All</option>
            {namespaces.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </Box>

      {isLoading && (
        <Typography>{t('loading')}</Typography>
      )}

      <Box
        component="table"
        style={{ width: '100%', borderCollapse: 'collapse' }}
        aria-label="Translation entries"
        data-testid="translation-table"
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>
              Namespace
            </th>
            <th style={{ textAlign: 'left', padding: 8 }}>
              Key
            </th>
            <th style={{ textAlign: 'left', padding: 8 }}>
              Value
            </th>
            <th style={{ padding: 8 }}>Actions</th>
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
    </Box>
  );
}
