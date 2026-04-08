/**
 * Persistence state and convenience setters
 */

import { useState, useCallback } from 'react';

/** Initialize all persistence state values */
export function usePersistenceState(
  initAuto: boolean
) {
  const [isDirty, setIsDirty] =
    useState(false);
  const [isSaving, setIsSaving] =
    useState(false);
  const [isLoading, setIsLoading] =
    useState(false);
  const [lastSaved, setLastSaved] =
    useState<number | null>(null);
  const [saveError, setSaveError] =
    useState<string | null>(null);
  const [loadError, setLoadError] =
    useState<string | null>(null);
  const [isAutoSaveEnabled, setAutoSave] =
    useState(initAuto);

  const markDirty = useCallback(
    () => setIsDirty(true), []
  );
  const markClean = useCallback(
    () => setIsDirty(false), []
  );
  const enableAutoSave = useCallback(
    () => setAutoSave(true), []
  );
  const disableAutoSave = useCallback(
    () => setAutoSave(false), []
  );

  return {
    isDirty, isSaving, isLoading,
    lastSaved, saveError, loadError,
    isAutoSaveEnabled,
    setIsDirty, setIsSaving, setIsLoading,
    setLastSaved, setSaveError, setLoadError,
    setAutoSave,
    markDirty, markClean,
    enableAutoSave, disableAutoSave,
  };
}
