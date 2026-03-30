/**
 * Hook to manage editable prop values for
 * the currently selected component.
 * @module hooks/usePropState
 */
import {
  useState, useEffect, useCallback,
} from 'react';
import type { ComponentDef } from '../types';

/** Maps prop names to their current values. */
export type PropValues = Record<
  string,
  string | boolean | number
>;

/**
 * @brief Manages editable prop state.
 * Resets to defaults when component changes.
 * @param def - The active component definition.
 * @returns Current values and an updater.
 */
export function usePropState(
  def: ComponentDef | null,
) {
  const [values, setValues] =
    useState<PropValues>({});

  useEffect(() => {
    if (!def) {
      setValues({});
      return;
    }
    const defaults: PropValues = {};
    for (const p of def.props) {
      defaults[p.name] = p.defaultValue;
    }
    setValues(defaults);
  }, [def]);

  const update = useCallback(
    (name: string, val: string | boolean | number) =>
      setValues((prev) => ({ ...prev, [name]: val })),
    [],
  );

  return { values, update } as const;
}
