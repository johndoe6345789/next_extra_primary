import type {
  TypographyVariantsOptions,
} from '@mui/material/styles';

/**
 * MD3-inspired typography scale.
 *
 * Maps Material Design 3 type roles (display, headline,
 * title, body, label) to MUI typography variants using
 * the system font stack for optimal performance.
 *
 * @returns A complete MUI TypographyVariantsOptions object.
 */
export function typography(): TypographyVariantsOptions {
  const fontFamily = [
    '"Roboto"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', ');

  return {
    fontFamily,

    /* --- Display --- */
    h1: {
      fontSize: '3.5625rem', // 57px — Display Large
      fontWeight: 400,
      lineHeight: 1.12,
      letterSpacing: '-0.25px',
    },
    h2: {
      fontSize: '2.8125rem', // 45px — Display Medium
      fontWeight: 400,
      lineHeight: 1.16,
      letterSpacing: '0px',
    },
    h3: {
      fontSize: '2.25rem', // 36px — Display Small
      fontWeight: 400,
      lineHeight: 1.22,
      letterSpacing: '0px',
    },

    /* --- Headline --- */
    h4: {
      fontSize: '2rem', // 32px — Headline Large
      fontWeight: 400,
      lineHeight: 1.25,
      letterSpacing: '0px',
    },
    h5: {
      fontSize: '1.75rem', // 28px — Headline Medium
      fontWeight: 400,
      lineHeight: 1.29,
      letterSpacing: '0px',
    },
    h6: {
      fontSize: '1.5rem', // 24px — Headline Small
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0px',
    },

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
}
