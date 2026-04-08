'use client';

import type { WhereCondition } from './queryBuilderTypes';

/**
 * Handlers for managing WHERE conditions.
 * @param conditions - Current conditions.
 * @param setConditions - State setter.
 * @returns Condition management callbacks.
 */
export function useQueryConditions(
  conditions: WhereCondition[],
  setConditions: (c: WhereCondition[]) => void
) {
  /** Add a blank condition row. */
  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { column: '', operator: '=', value: '' },
    ]);
  };

  /** Remove a condition by index. */
  const handleRemoveCondition = (
    index: number
  ) => {
    setConditions(
      conditions.filter((_, i) => i !== index)
    );
  };

  /** Update a single field of a condition. */
  const handleConditionChange = (
    index: number,
    field: keyof WhereCondition,
    value: string
  ) => {
    const updated = [...conditions];
    if (updated[index]) {
      updated[index][field] = value;
    }
    setConditions(updated);
  };

  return {
    handleAddCondition,
    handleRemoveCondition,
    handleConditionChange,
  };
}
