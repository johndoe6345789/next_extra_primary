/**
 * Save/load operations for persistence
 */

import { useCallback, type RefObject } from 'react';
import type {
  Workflow,
} from '../../types/workflow-editor';

/** Create save callback */
export function useSaveOperation(
  onSave:
    | ((w: Workflow) => Promise<void>)
    | undefined,
  wfRef: RefObject<Workflow>,
  setIsSaving: (v: boolean) => void,
  setSaveError: (e: string | null) => void,
  setLastSaved: (t: number) => void,
  setIsDirty: (v: boolean) => void
) {
  return useCallback(async () => {
    if (!onSave) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(wfRef.current);
      setLastSaved(Date.now());
      setIsDirty(false);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to save';
      setSaveError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [
    onSave,
    wfRef,
    setIsSaving,
    setSaveError,
    setLastSaved,
    setIsDirty,
  ]);
}

/** Create load callback */
export function useLoadOperation(
  onLoad:
    | ((id: string) => Promise<Workflow>)
    | undefined,
  setIsLoading: (v: boolean) => void,
  setLoadError: (e: string | null) => void,
  setIsDirty: (v: boolean) => void,
  setLastSaved: (t: number) => void
) {
  return useCallback(
    async (id: string) => {
      if (!onLoad) return;
      setIsLoading(true);
      setLoadError(null);
      try {
        await onLoad(id);
        setIsDirty(false);
        setLastSaved(Date.now());
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to load';
        setLoadError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      onLoad,
      setIsLoading,
      setLoadError,
      setIsDirty,
      setLastSaved,
    ]
  );
}
