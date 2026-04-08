/**
 * Category expansion callbacks
 */

import { useState, useCallback } from 'react';
import type { NodeCategory } from './nodeTypesTypes';

/** Hook for category expand/collapse */
export function useNodeTypeCategories(
  initialCategories: Record<string, NodeCategory>,
  autoExpand: boolean
) {
  const [expanded, setExpanded] = useState(() =>
    Object.keys(initialCategories).reduce(
      (a, k) => ({
        ...a,
        [k]: autoExpand,
      }),
      {} as Record<string, boolean>
    )
  );

  const [categories, setCategories] = useState(
    initialCategories
  );

  const toggleCategory = useCallback(
    (id: string) =>
      setExpanded((p) => ({
        ...p,
        [id]: !p[id],
      })),
    []
  );

  const expandAllCategories = useCallback(
    () =>
      setExpanded(
        Object.keys(categories).reduce(
          (a, k) => ({ ...a, [k]: true }),
          {}
        )
      ),
    [categories]
  );

  const collapseAllCategories = useCallback(
    () =>
      setExpanded(
        Object.keys(categories).reduce(
          (a, k) => ({ ...a, [k]: false }),
          {}
        )
      ),
    [categories]
  );

  /** Merge new categories into state */
  const mergeCategories = useCallback(
    (
      newCats: Record<string, NodeCategory>,
      autoExpandNew: boolean
    ) => {
      setCategories(newCats);
      setExpanded((prev) => {
        const u = { ...prev };
        Object.keys(newCats).forEach((k) => {
          if (!(k in u)) u[k] = autoExpandNew;
        });
        return u;
      });
    },
    []
  );

  return {
    categories,
    expandedCategories: expanded,
    toggleCategory,
    expandAllCategories,
    collapseAllCategories,
    mergeCategories,
  };
}
