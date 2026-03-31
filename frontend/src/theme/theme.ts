/**
 * @file theme.ts
 * @brief M3 theme entry point.
 *
 * Theming is now handled by @metabuilder/scss via CSS
 * variables (--mat-sys-primary, --mat-sys-surface, etc).
 * This module re-exports design token metadata for any
 * code that needs programmatic access to token values.
 *
 * @example
 * ```tsx
 * import { tokens } from '@/theme/theme';
 * console.log(tokens.light.primary);
 * ```
 */
import tokens from './tokens.json';

/** Light and dark M3 colour tokens. */
export { tokens };
