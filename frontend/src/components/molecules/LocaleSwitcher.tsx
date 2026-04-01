'use client';

import React, { useCallback } from 'react';
import MuiSelect from '@shared/m3/Select';
import MenuItem from '@shared/m3/MenuItem';
import type { SelectChangeEvent } from '@shared/m3';
import { useLocale } from '@/hooks';

/** Short labels for supported locales. */
const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  ja: 'JA',
};

/**
 * Props for the LocaleSwitcher component.
 */
export interface LocaleSwitcherProps {
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * A dropdown select that allows the user to switch
 * the active locale. On change it navigates to the
 * current path under the newly selected locale
 * prefix.
 *
 * @param props - Component props.
 * @returns The locale switcher element.
 */
export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({
  testId = 'locale-switcher',
}) => {
  const { locale, setLocale, locales } = useLocale();

  const handleChange = useCallback(
    (e: SelectChangeEvent<string | string[]>) => {
      const val = Array.isArray(e.target.value)
        ? e.target.value[0]
        : e.target.value;
      setLocale(val as Parameters<typeof setLocale>[0]);
    },
    [setLocale],
  );

  return (
    <MuiSelect
      value={locale}
      onChange={handleChange}
      size="small"
      aria-label="Select language"
      data-testid={testId}
      sx={{ minWidth: 64 }}
    >
      {locales.map((loc) => (
        <MenuItem key={loc} value={loc} data-testid={`${testId}-${loc}`}>
          {LOCALE_LABELS[loc] ?? loc}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export default LocaleSwitcher;
