/**
 * Types for the auto-fix selector analyzer.
 */

/** Result of analyzing a selector. */
export interface SelectorFix {
  originalSelector: string
  suggestedSelectors: string[]
  confidence: 'high' | 'medium' | 'low'
  reason: string
}
