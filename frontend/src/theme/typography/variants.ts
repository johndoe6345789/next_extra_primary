/**
 * @file variants.ts
 * @brief MD3 Title, Body, and Label variant reference.
 *
 * These values are kept as a programmatic reference.
 * Runtime styling is handled by @shared/scss
 * CSS variables.
 */

/** Title, Body, and Label variant tokens. */
export const titlesAndBody = {
  /* --- Title --- */
  subtitle1: {
    fontSize: '1.375rem', // 22px -- Title Large
    fontWeight: 500,
    lineHeight: 1.27,
    letterSpacing: '0px',
  },
  subtitle2: {
    fontSize: '1rem', // 16px -- Title Medium
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.15px',
  },

  /* --- Body --- */
  body1: {
    fontSize: '1rem', // 16px -- Body Large
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.5px',
  },
  body2: {
    fontSize: '0.875rem', // 14px -- Body Medium
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.25px',
  },

  /* --- Label --- */
  button: {
    fontSize: '0.875rem', // 14px -- Label Large
    fontWeight: 500,
    lineHeight: 1.43,
    letterSpacing: '0.1px',
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem', // 12px -- Label Medium
    fontWeight: 500,
    lineHeight: 1.33,
    letterSpacing: '0.5px',
  },
  overline: {
    fontSize: '0.6875rem', // 11px -- Label Small
    fontWeight: 500,
    lineHeight: 1.45,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
  },
} as const;
