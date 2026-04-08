/**
 * Multi-step sequential mutation hook
 */

import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type {
  MultiMutationStep,
  UseMultiMutationResult,
} from './mutationTypes';
import { useReduxMutation } from
  './useReduxMutation';

/** Execute multiple mutations in sequence */
export function useReduxMultiMutation<
  TData = unknown, TResponse = unknown
>(
  steps: MultiMutationStep<TData, TResponse>[],
  options?: {
    onAllSuccess?: (r: TResponse[]) => void;
    onStepSuccess?: (
      name: string, data: TResponse
    ) => void;
    onError?: (
      name: string, error: string
    ) => void;
  }
): UseMultiMutationResult<TResponse> {
  const dispatch = useDispatch();
  const stepRef = useRef(-1);
  const resultsRef = useRef<TResponse[]>([]);
  const errorRef = useRef<string | null>(null);
  const loadingRef = useRef(false);

  const stepMutations = steps.map((step) =>
    useReduxMutation<TData, TResponse>(step.fn, {
      onSuccess: (data) => {
        resultsRef.current.push(data);
        options?.onStepSuccess?.(
          step.name, data);
        step.onSuccess?.(data);
      },
      onError: (err) => {
        errorRef.current = err;
        options?.onError?.(step.name, err);
        step.onError?.(err);
      },
    })
  );

  const execute = useCallback(async (
    payload: unknown
  ): Promise<TResponse[]> => {
    resultsRef.current = [];
    errorRef.current = null;
    loadingRef.current = true;
    try {
      for (let i = 0; i < steps.length; i++) {
        stepRef.current = i;
        const r = await stepMutations[i]
          .mutate(payload as TData);
        resultsRef.current.push(r);
      }
      options?.onAllSuccess?.(resultsRef.current);
      return resultsRef.current;
    } finally {
      loadingRef.current = false;
      stepRef.current = -1;
    }
  }, [steps, stepMutations, options]);

  const reset = useCallback(() => {
    resultsRef.current = [];
    errorRef.current = null;
    stepRef.current = -1;
    stepMutations.forEach((m) => m.reset());
  }, [stepMutations]);

  return {
    execute,
    currentStep: stepRef.current,
    isLoading: loadingRef.current,
    error: errorRef.current,
    reset,
  };
}
