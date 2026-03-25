/**
 * @file typeScale.ts
 * @brief MD3 Display and Headline size/weight scale (h1–h6).
 */
import type { TypographyVariantsOptions } from '@mui/material/styles';

/**
 * Display and Headline variant tokens mapped to MUI h1–h6.
 *
 * Covers MD3 roles: Display Large/Medium/Small and
 * Headline Large/Medium/Small.
 */
export const displayAndHeadline: Pick<
  TypographyVariantsOptions,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> = {
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
};
