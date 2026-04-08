/** Props for GridSettings component. */
export interface GridSettingsProps {
  gridVisible: boolean;
  gridSnapping: boolean;
  gridSize: number;
  gridStyle: 'dots' | 'lines';
  onSettingChange: (
    key: string,
    value: boolean | number | string
  ) => void;
  testId?: string;
}
