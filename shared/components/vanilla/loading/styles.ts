/**
 * CSS keyframes for loading animations.
 *
 * @example
 * // Add to your global CSS:
 * import { loadingStyles } from './styles'
 */
export const loadingStyles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pulse-animation {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes progress-animation {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}
@keyframes dots-animation {
  0%, 80%, 100% { opacity: 0; transform: scale(0); }
  40% { opacity: 1; transform: scale(1); }
}
`
