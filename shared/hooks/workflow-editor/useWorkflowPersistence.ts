/**
 * useWorkflowPersistence Hook
 * Save/load with auto-save and dirty tracking
 */

import type {
  UseWorkflowPersistenceReturn,
  UseWorkflowPersistenceOptions,
} from './workflowPersistenceTypes';
import {
  useWorkflowRef,
  useAutoSaveEffect,
  useBeforeUnloadEffect,
} from './workflowPersistenceEffects';
import {
  useSaveOperation,
  useLoadOperation,
} from './workflowPersistenceOps';
import {
  usePersistenceState,
} from './workflowPersistenceState';

export type {
  UseWorkflowPersistenceReturn,
  UseWorkflowPersistenceOptions,
} from './workflowPersistenceTypes';

/** Hook for workflow persistence */
export function useWorkflowPersistence(
  opts: UseWorkflowPersistenceOptions
): UseWorkflowPersistenceReturn {
  const {
    workflow,
    onSave,
    onLoad,
    autoSaveDelay = 30000,
    autoSaveEnabled: initAuto = false,
  } = opts;

  const s = usePersistenceState(initAuto);
  const wfRef = useWorkflowRef(workflow);

  const save = useSaveOperation(
    onSave, wfRef,
    s.setIsSaving, s.setSaveError,
    s.setLastSaved, s.setIsDirty
  );

  const load = useLoadOperation(
    onLoad, s.setIsLoading, s.setLoadError,
    s.setIsDirty, s.setLastSaved
  );

  useAutoSaveEffect(
    s.isAutoSaveEnabled, s.isDirty,
    s.isSaving, autoSaveDelay, save
  );
  useBeforeUnloadEffect(s.isDirty);

  return {
    isDirty: s.isDirty,
    isSaving: s.isSaving,
    isLoading: s.isLoading,
    lastSaved: s.lastSaved,
    saveError: s.saveError,
    loadError: s.loadError,
    save, load,
    markDirty: s.markDirty,
    markClean: s.markClean,
    enableAutoSave: s.enableAutoSave,
    disableAutoSave: s.disableAutoSave,
    isAutoSaveEnabled: s.isAutoSaveEnabled,
  };
}
