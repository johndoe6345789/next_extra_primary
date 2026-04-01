/**
 * @file fontFamilies.ts
 * @brief System font stack reference for M3 typography.
 *
 * Runtime font loading is handled by @shared/scss.
 * This value is kept for programmatic access.
 */

/**
 * Primary font family string.
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
