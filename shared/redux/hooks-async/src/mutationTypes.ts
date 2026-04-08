/**
 * Mutation hook types
 */

/** Options for useReduxMutation */
export interface UseMutationOptions<
  TData = unknown, TResponse = unknown
> {
  /** Called on success */
  onSuccess?: (data: TResponse) => void;
  /** Called on error */
  onError?: (error: string) => void;
  /** Called when status changes */
  onStatusChange?: (status:
    'idle' | 'pending' |
    'succeeded' | 'failed'
  ) => void;
}

/** Result from useReduxMutation */
export interface UseMutationResult<
  TData = unknown, TResponse = unknown
> {
  /** Execute the mutation */
  mutate: (payload: TData) => Promise<TResponse>;
  /** True if in progress */
  isLoading: boolean;
  /** Error message if failed */
  error: string | null;
  /** Reset mutation state */
  reset: () => void;
  /** Current status */
  status:
    'idle' | 'pending' |
    'succeeded' | 'failed';
}

/** Multi-mutation step definition */
export interface MultiMutationStep<
  TData = unknown, TResponse = unknown
> {
  name: string;
  fn: (payload: TData) => Promise<TResponse>;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: string) => void;
}

/** Result from useReduxMultiMutation */
export interface UseMultiMutationResult<
  TResponse = unknown
> {
  /** Execute mutations in sequence */
  execute: (
    payload: unknown
  ) => Promise<TResponse[]>;
  /** Current step (0-indexed, -1 if idle) */
  currentStep: number;
  /** True if any step is in progress */
  isLoading: boolean;
  /** Error from current step */
  error: string | null;
  /** Reset to initial state */
  reset: () => void;
}
