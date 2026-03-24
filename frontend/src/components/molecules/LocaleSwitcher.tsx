'use client';

import React, { useCallback } from 'react';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material';
import { useLocale } from '@/hooks';

/** Display labels for supported locales. */
const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Espanol',
  fr: 'Francais',
  de: 'Deutsch',
  ja: 'Japanese',
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
    (e: SelectChangeEvent<string>) => {
      setLocale(e.target.value as Parameters<typeof setLocale>[0]);
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
      sx={{ minWidth: 120 }}
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
