/**
 * Node type registration callbacks
 */

import { useCallback } from 'react';
import type {
  NodeTypeDefinition,
} from './nodeTypesTypes';

/** Setter for node types state */
type SetNodeTypes = React.Dispatch<
  React.SetStateAction<NodeTypeDefinition[]>
>;

/** Create registration callbacks */
export function useNodeTypeRegistration(
  setNodeTypes: SetNodeTypes
) {
  const registerNodeType = useCallback(
    (nt: NodeTypeDefinition) => {
      setNodeTypes((prev) => {
        const exists = prev.some(
          (n) => n.id === nt.id
        );
        if (exists) {
          return prev.map((n) =>
            n.id === nt.id ? nt : n
          );
        }
        return [...prev, nt];
      });
    },
    [setNodeTypes]
  );

  const registerNodeTypes = useCallback(
    (newTypes: NodeTypeDefinition[]) => {
      setNodeTypes((prev) => {
        const merged = [...prev];
        newTypes.forEach((t) => {
          const idx = merged.findIndex(
            (n) => n.id === t.id
          );
          if (idx >= 0) merged[idx] = t;
          else merged.push(t);
        });
        return merged;
      });
    },
    [setNodeTypes]
  );

  const unregisterNodeType = useCallback(
    (id: string) => {
      setNodeTypes((p) =>
        p.filter((n) => n.id !== id)
      );
    },
    [setNodeTypes]
  );

  return {
    registerNodeType,
    registerNodeTypes,
    unregisterNodeType,
  };
}

/** Create query callbacks */
export function useNodeTypeQueries(
  nodeTypes: NodeTypeDefinition[]
) {
  const getNodeType = useCallback(
    (id: string) =>
      nodeTypes.find((n) => n.id === id),
    [nodeTypes]
  );

  const getNodeTypesByCategory = useCallback(
    (catId: string) =>
      nodeTypes.filter(
        (n) => n.category === catId
      ),
    [nodeTypes]
  );

  return { getNodeType, getNodeTypesByCategory };
}
