/**
 * Types for useWorkflowPersistence
 */

import type {
  Workflow,
} from '../../types/workflow-editor';

/** Return type of useWorkflowPersistence */
export interface UseWorkflowPersistenceReturn {
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: number | null;
  saveError: string | null;
  loadError: string | null;
  save: () => Promise<void>;
  load: (workflowId: string) => Promise<void>;
  markDirty: () => void;
  markClean: () => void;
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  isAutoSaveEnabled: boolean;
}

/** Options for useWorkflowPersistence */
export interface UseWorkflowPersistenceOptions {
  workflow: Workflow;
  onSave?: (w: Workflow) => Promise<void>;
  onLoad?: (
    id: string
  ) => Promise<Workflow>;
  autoSaveDelay?: number;
  autoSaveEnabled?: boolean;
}
