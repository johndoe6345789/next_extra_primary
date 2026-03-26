/**
 * @file typography.ts
 * @brief Aggregates the MD3-inspired MUI typography configuration.
 *
 * Sub-modules:
 * - `typography/fontFamilies` — font stack
 * - `typography/typeScale`    — Display & Headline (h1–h6)
 * - `typography/variants`     — Title, Body, Label variants
 */
import type { TypographyVariantsOptions } from '@mui/material/styles';

import { fontFamily } from './typography/fontFamilies';
import { displayAndHeadline } from './typography/typeScale';
import { titlesAndBody } from './typography/variants';

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
  return {
    fontFamily,
    ...displayAndHeadline,
    ...titlesAndBody,
  };
}
