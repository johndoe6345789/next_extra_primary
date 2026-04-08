'use client';

import { useState, useCallback } from 'react';

interface CanvasSettingsState {
  gridVisible: boolean;
  gridSnapping: boolean;
  gridSize: number;
  gridStyle: 'dots' | 'lines';
  autoSave: boolean;
  autoSaveInterval: number;
  zoomInvert: boolean;
  panDirection: 'shift' | 'space' | 'middle';
  cardPreviewSize: 'small' | 'medium' | 'large';
  showCardDescriptions: boolean;
  cardAnimations: boolean;
  enableVirtualization: boolean;
  maxConcurrentRenders: number;
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
}

/**
 * Hook for canvas settings state and save logic.
 */
export function useCanvasSettings() {
  const [settings, setSettings] =
    useState<CanvasSettingsState>({
      gridVisible: true,
      gridSnapping: true,
      gridSize: 20,
      gridStyle: 'dots',
      autoSave: true,
      autoSaveInterval: 30,
      zoomInvert: false,
      panDirection: 'shift',
      cardPreviewSize: 'medium',
      showCardDescriptions: true,
      cardAnimations: true,
      enableVirtualization: true,
      maxConcurrentRenders: 50,
      defaultZoom: 100,
      minZoom: 10,
      maxZoom: 300,
    });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] =
    useState('');

  const handleSettingChange = useCallback(
    (
      key: string,
      value: string | number | boolean
    ) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
      setSaveMessage('');
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise((r) =>
        setTimeout(r, 800)
      );
      setSaveMessage('Settings saved');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    settings,
    isSaving,
    saveMessage,
    handleSettingChange,
    handleSave,
  };
}
