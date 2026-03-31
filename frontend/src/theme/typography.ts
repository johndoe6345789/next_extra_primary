/**
 * @file typography.ts
 * @brief M3 typography token reference.
 *
 * Typography is now handled by @metabuilder/scss via
 * CSS variables. These sub-module re-exports remain
 * available for programmatic access.
 *
 * Sub-modules:
 * - `typography/fontFamilies` -- font stack
 * - `typography/typeScale`    -- Display & Headline
 * - `typography/variants`     -- Title, Body, Label
 */
export { fontFamily } from './typography/fontFamilies';
export {
  displayAndHeadline,
} from './typography/typeScale';
export { titlesAndBody } from './typography/variants';
