import { useState } from 'react';

/**
 * Hook managing expand/collapse and selection
 * state for TreeView nodes.
 */
export function useTreeView(
  ctrlExpanded: string[] | undefined,
  defaultExpanded: string[],
  ctrlSelected: string | string[] | undefined,
  defaultSelected: string | string[],
  multiSelect: boolean,
  disableSelection: boolean,
  onNodeToggle?: (
    e: React.SyntheticEvent,
    ids: string[]
  ) => void,
  onNodeSelect?: (
    e: React.SyntheticEvent,
    ids: string | string[]
  ) => void
) {
  const [intExp, setIntExp] =
    useState<string[]>(defaultExpanded);
  const [intSel, setIntSel] = useState<
    string[]
  >(
    Array.isArray(defaultSelected)
      ? defaultSelected
      : [defaultSelected]
  );

  const expanded = ctrlExpanded ?? intExp;
  const selected = ctrlSelected ?? intSel;

  const handleToggle = (
    e: React.SyntheticEvent,
    nodeId: string
  ) => {
    const next = expanded.includes(nodeId)
      ? expanded.filter((id) => id !== nodeId)
      : [...expanded, nodeId];
    if (ctrlExpanded === undefined)
      setIntExp(next);
    onNodeToggle?.(e, next);
  };

  const handleSelect = (
    e: React.SyntheticEvent,
    nodeId: string
  ) => {
    if (disableSelection) return;
    const arr = Array.isArray(selected)
      ? selected
      : [selected];
    const next = multiSelect
      ? arr.includes(nodeId)
        ? arr.filter((id) => id !== nodeId)
        : [...arr, nodeId]
      : [nodeId];
    if (ctrlSelected === undefined)
      setIntSel(next);
    onNodeSelect?.(
      e,
      multiSelect ? next : nodeId
    );
  };

  return {
    expanded,
    selected: Array.isArray(selected)
      ? selected
      : [selected],
    handleToggle,
    handleSelect,
  };
}
