/**
 * @file variants.ts
 * @brief MD3 Title, Body, and Label MUI variant overrides.
 */
import type { TypographyVariantsOptions } from '@mui/material/styles';

/**
 * Title, Body, and Label variant tokens mapped to MUI
 * subtitle1/2, body1/2, button, caption, and overline.
 *
 * Covers MD3 roles: Title Large/Medium, Body Large/Medium,
 * Label Large/Medium/Small.
 */
export const titlesAndBody: Pick<
  TypographyVariantsOptions,
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline'
> = {
  /* --- Title --- */
  subtitle1: {
    fontSize: '1.375rem', // 22px — Title Large
    fontWeight: 500,
    lineHeight: 1.27,
    letterSpacing: '0px',
  },
  subtitle2: {
    fontSize: '1rem', // 16px — Title Medium
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },

  /* --- Body --- */
  body1: {
    fontSize: '1rem', // 16px — Body Large
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.5px',
  },
  body2: {
    fontSize: '0.875rem', // 14px — Body Medium
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.25px',
  },

  /* --- Label --- */
  button: {
    fontSize: '0.875rem', // 14px — Label Large
    fontWeight: 500,
    lineHeight: 1.43,
    letterSpacing: '0.1px',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem', // 12px — Label Medium
    fontWeight: 500,
    lineHeight: 1.33,
    letterSpacing: '0.5px',
  },
  overline: {
    fontSize: '0.6875rem', // 11px — Label Small
    fontWeight: 500,
    lineHeight: 1.45,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};
