import type React from 'react';

/** Color palette for workspace creation. */
export const WORKSPACE_COLORS = [
  '#6750A4', '#625B71', '#7D5260', '#BA1A1A',
  '#006E1C', '#00639B', '#A8541D', '#5C5C5C',
];

/** Props for the CreateWorkspaceForm component. */
export interface CreateWorkspaceFormProps {
  /** Current workspace name */
  name: string;
  /** Name change handler */
  onNameChange: (name: string) => void;
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void;
  /** Cancel handler */
  onCancel: () => void;
  [key: string]: unknown;
}
