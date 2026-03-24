import type { PaletteOptions } from '@mui/material/styles';
import tokens from './tokens.json';

/** MD3 color token set for a single color scheme. */
type ColorTokens = (typeof tokens)['light'];

/**
 * Map a set of MD3 design tokens to a MUI PaletteOptions
 * object. Keeps one source of truth for all colour values.
 *
 * @param t - The colour token set (light or dark).
 * @param mode - The MUI palette mode string.
 * @returns A complete MUI PaletteOptions object.
 */
function tokensToPalette(
  t: ColorTokens,
  mode: 'light' | 'dark',
): PaletteOptions {
  return {
    mode,
    primary: {
      main: t.primary,
      contrastText: t.onPrimary,
    },
    secondary: {
      main: t.secondary,
      contrastText: t.onSecondary,
    },
    error: {
      main: t.error,
    },
    background: {
      default: t.background,
      paper: t.surface,
    },
    text: {
      primary: t.onSurface,
    },
  };
}

/**
 * Build a MUI palette for the light colour scheme.
 *
 * @returns PaletteOptions configured with light tokens.
 */
export function lightPalette(): PaletteOptions {
  return tokensToPalette(tokens.light, 'light');
}

/**
 * Build a MUI palette for the dark colour scheme.
 *
 * @returns PaletteOptions configured with dark tokens.
 */
export function darkPalette(): PaletteOptions {
  return tokensToPalette(tokens.dark, 'dark');
}
