/**
 * Progress barrel - re-exports LinearProgress and
 * CircularProgress from their dedicated modules.
 */

export type {
  LinearProgressProps,
  CircularProgressProps,
} from './ProgressTypes'

export { LinearProgress } from './ProgressLinear'
export { CircularProgress } from './ProgressCircular'

/** Alias for LinearProgress */
export { LinearProgress as Progress } from './ProgressLinear'
