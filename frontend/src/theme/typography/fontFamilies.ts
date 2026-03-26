/**
 * @file fontFamilies.ts
 * @brief System font stack used across the MD3 typography scale.
 */

/**
 * Primary font family string for MUI typography.
 *
 * Uses Roboto with a system-font fallback chain for
 * optimal cross-platform rendering performance.
 */
export const fontFamily: string = [
  '"Roboto"',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(', ');
