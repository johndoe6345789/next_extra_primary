import { ProjectCanvasItem } from '../types';

/** Props for the WorkflowCard component. */
export interface WorkflowCardProps {
  item: ProjectCanvasItem;
  workflow: {
    id?: string;
    name?: string;
    nodes?: unknown[];
    connections?: unknown[];
  };
  isSelected: boolean;
  onSelect: (
    id: string,
    multiSelect: boolean
  ) => void;
  onUpdatePosition: (
    id: string,
    x: number,
    y: number
  ) => void;
  onUpdateSize: (
    id: string,
    width: number,
    height: number
  ) => void;
  onDelete: (id: string) => void;
  onOpen: (workflowId: string) => void;
  zoom: number;
  snapToGrid: (pos: {
    x: number;
    y: number;
  }) => { x: number; y: number };
}
