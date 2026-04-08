'use client';
/**
 * SettingsModal Component
 * Settings interface with tabbed navigation.
 */

import React, { useState } from 'react';
import { SettingsTabNav }
  from './SettingsTabNav';
import { SettingsTabPanels }
  from './SettingsTabPanels';
import { testId } from './accessibility';

type SettingsTab =
  | 'account'
  | 'security'
  | 'canvas'
  | 'notifications';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountDeleted?: () => void;
}

/**
 * Main settings modal with tabbed navigation.
 */
export const SettingsModal: React.FC<
  SettingsModalProps
> = ({ isOpen, onClose, onAccountDeleted }) => {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>('account');

  if (!isOpen) return null;

  const handleAccountDeleted = () => {
    onAccountDeleted?.();
    onClose();
  };

  return (
    <div onClick={onClose} role="presentation"
      data-testid={testId.modal('settings')}>
      <div onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
        aria-labelledby="settings-title">
        <div>
          <h1 id="settings-title">Settings</h1>
          <button onClick={onClose}
            title="Close settings"
            aria-label="Close settings"
            data-testid={testId.modalClose(
              'settings')}>
            X
          </button>
        </div>
        <SettingsTabNav activeTab={activeTab}
          onTabChange={setActiveTab} />
        <SettingsTabPanels
          activeTab={activeTab}
          onAccountDeleted={
            handleAccountDeleted} />
      </div>
    </div>
  );
};

export default SettingsModal;
