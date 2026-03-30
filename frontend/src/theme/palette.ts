/**
 * @file palette.ts
 * @brief M3 colour token reference.
 *
 * Palette mapping is no longer needed because
 * @metabuilder/scss injects CSS variables directly.
 * This module re-exports the raw token sets for any
 * code that needs programmatic colour access.
 */
import tokens from './tokens.json';

/** Light colour tokens from the M3 design system. */
export const lightTokens = tokens.light;

/** Dark colour tokens from the M3 design system. */
export const darkTokens = tokens.dark;
