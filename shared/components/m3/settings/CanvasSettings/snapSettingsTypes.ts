/** Props for SnapSettings component. */
export interface SnapSettingsProps {
  autoSave: boolean;
  autoSaveInterval: number;
  zoomInvert: boolean;
  panDirection: 'shift' | 'space' | 'middle';
  onSettingChange: (
    key: string,
    value: boolean | number | string
  ) => void;
  testId?: string;
}
