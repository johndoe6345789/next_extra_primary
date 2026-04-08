/**
 * CSS styles for empty state animations.
 *
 * @example
 * // Add to your global CSS or inject via style tag:
 * .empty-state-animated {
 *   animation: fadeIn 0.3s ease-in-out;
 * }
 */
export const emptyStateStyles = `
.empty-state-animated {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .empty-state-animated {
    animation: none;
  }
}
`
