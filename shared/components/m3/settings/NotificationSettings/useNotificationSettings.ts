'use client';

import { useState, useCallback } from 'react';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
} from './notificationDefaults';

/**
 * Hook for notification settings state
 * and save logic.
 */
export function useNotificationSettings() {
  const [settings, setSettings] =
    useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [isSaving, setIsSaving] =
    useState(false);
  const [saveMessage, setSaveMessage] =
    useState('');

  const handleSettingChange = useCallback(
    (key: string, value: boolean) => {
      setSettings((prev) => ({
        ...prev, [key]: value,
      }));
      setSaveMessage('');
    }, []);

  const handleSave = useCallback(
    async () => {
      setIsSaving(true);
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 800));
        setSaveMessage('Preferences saved');
        setTimeout(
          () => setSaveMessage(''), 3000);
      } catch {
        setSaveMessage(
          'Failed to save preferences');
      } finally { setIsSaving(false); }
    }, []);

  const handleClearHistoryItem = useCallback(
    (_id: string) => {
      // TODO: Implement clear history item
    }, []);

  const handleClearAllHistory = useCallback(
    () => {
      // TODO: Implement clear all history
    }, []);

  return {
    settings, isSaving, saveMessage,
    handleSettingChange, handleSave,
    handleClearHistoryItem,
    handleClearAllHistory,
  };
}
