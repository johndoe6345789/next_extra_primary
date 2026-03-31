/**
 * Hook to manage the currently selected
 * component in the viewer sidebar.
 * @module hooks/useSelectedComponent
 */
import { useState, useCallback } from 'react';
import type { ComponentDef } from '../types';

/** Return type for the hook. */
interface SelectedState {
  /** Currently selected component def. */
  readonly selected: ComponentDef | null;
  /** Set a new selected component. */
  readonly select: (def: ComponentDef) => void;
}

/**
 * @brief Manages which component is active.
 * @param initial - Optional initial component.
 * @returns Selected state and setter.
 */
export function useSelectedComponent(
  initial: ComponentDef | null = null,
): SelectedState {
  const [selected, setSelected] =
    useState<ComponentDef | null>(initial);

  const select = useCallback(
    (def: ComponentDef) => setSelected(def),
    [],
  );

  return { selected, select } as const;
}
