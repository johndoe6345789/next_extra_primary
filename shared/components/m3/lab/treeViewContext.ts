import { createContext } from 'react';

/** Context type for TreeView state. */
export interface TreeViewContextType {
  expanded: string[];
  selected: string[];
  multiSelect: boolean;
  dense: boolean;
  onNodeToggle: (
    event: React.SyntheticEvent,
    nodeId: string
  ) => void;
  onNodeSelect: (
    event: React.SyntheticEvent,
    nodeId: string
  ) => void;
  defaultCollapseIcon?: React.ReactNode;
  defaultEndIcon?: React.ReactNode;
  defaultExpandIcon?: React.ReactNode;
  defaultParentIcon?: React.ReactNode;
}

/** Shared context for TreeView nodes. */
export const TreeViewContext =
  createContext<TreeViewContextType>({
    expanded: [],
    selected: [],
    multiSelect: false,
    dense: false,
    onNodeToggle: () => {},
    onNodeSelect: () => {},
  });

/** Props for the TreeView component. */
export interface TreeViewProps
  extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
  defaultCollapseIcon?: React.ReactNode;
  defaultEndIcon?: React.ReactNode;
  defaultExpandIcon?: React.ReactNode;
  defaultParentIcon?: React.ReactNode;
  expanded?: string[];
  defaultExpanded?: string[];
  selected?: string | string[];
  defaultSelected?: string | string[];
  multiSelect?: boolean;
  dense?: boolean;
  onNodeToggle?: (
    event: React.SyntheticEvent,
    nodeIds: string[]
  ) => void;
  onNodeSelect?: (
    event: React.SyntheticEvent,
    nodeIds: string | string[]
  ) => void;
  disableSelection?: boolean;
  /** Test ID for automated testing */
  testId?: string;
}

/** Props for a single tree node item. */
export interface TreeItemProps
  extends React.LiHTMLAttributes<
    HTMLLIElement
  > {
  nodeId: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  ContentComponent?: React.ElementType;
  ContentProps?: Record<string, unknown>;
}
