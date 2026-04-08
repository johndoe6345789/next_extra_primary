/**
 * Side effects for workflow persistence
 */

import { useEffect, useRef } from 'react';
import type {
  Workflow,
} from '../../types/workflow-editor';

/**
 * Keep a mutable ref updated with the latest
 * workflow object.
 */
export function useWorkflowRef(
  workflow: Workflow
) {
  const ref = useRef(workflow);
  useEffect(() => {
    ref.current = workflow;
  }, [workflow]);
  return ref;
}

/**
 * Auto-save effect: triggers save after a delay
 * when the workflow is dirty and not saving.
 */
export function useAutoSaveEffect(
  isEnabled: boolean,
  isDirty: boolean,
  isSaving: boolean,
  delay: number,
  save: () => Promise<void>
) {
  const timerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (isEnabled && isDirty && !isSaving) {
      timerRef.current = setTimeout(() => {
        save().catch(() => {});
      }, delay);
    }
    return () => {
      if (timerRef.current)
        clearTimeout(timerRef.current);
    };
  }, [isEnabled, isDirty, isSaving, delay, save]);
}

/**
 * Warn before unload when there are unsaved
 * changes.
 */
export function useBeforeUnloadEffect(
  isDirty: boolean
) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Unsaved changes';
      }
    };
    window.addEventListener(
      'beforeunload',
      handler
    );
    return () =>
      window.removeEventListener(
        'beforeunload',
        handler
      );
  }, [isDirty]);
}
