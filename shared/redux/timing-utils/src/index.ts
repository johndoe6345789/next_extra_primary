/**
 * @shared/timing-utils
 *
 * Timing and debounce utilities for React.
 * Provides zero-dependency hooks for
 * debouncing values, debouncing saves,
 * tracking save timestamps, and
 * displaying save indicators.
 *
 * ## Hooks
 *
 * - useDebounce(value, delay?)
 *   Debounces a value, returns debounced copy.
 *
 * - useDebouncedSave(value, onSave, delay?)
 *   Debounces a save callback on value change.
 *
 * - useLastSaved(dependencies)
 *   Tracks timestamp of last dependency change.
 *
 * - useSaveIndicator(lastSaved, options?)
 *   Formats save time and indicates recency.
 *   Returns { timeAgo: string, isRecent: bool }
 */

export { useDebounce } from './use-debounce'
export {
  useDebouncedSave,
} from './use-debounced-save'
export { useLastSaved } from './use-last-saved'
export {
  useSaveIndicator,
} from './use-save-indicator'
