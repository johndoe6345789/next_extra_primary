'use client';

import React from 'react';
import { AccountSettings }
  from './sections/AccountSettings';
import { SecuritySettings }
  from './SecuritySettings/SecuritySettings';
import { CanvasSettings }
  from './sections/CanvasSettings';
import { NotificationSettings }
  from './sections/NotificationSettings';

type SettingsTab =
  | 'account'
  | 'security'
  | 'canvas'
  | 'notifications';

interface SettingsTabPanelsProps {
  activeTab: SettingsTab;
  onAccountDeleted: () => void;
}

/**
 * Renders the active settings tab panel.
 */
export const SettingsTabPanels: React.FC<
  SettingsTabPanelsProps
> = ({ activeTab, onAccountDeleted }) => (
  <div>
    {activeTab === 'account' && (
      <div role="tabpanel" id="settings-account">
        <AccountSettings />
      </div>
    )}
    {activeTab === 'security' && (
      <div role="tabpanel" id="settings-security">
        <SecuritySettings
          onAccountDeleted={onAccountDeleted} />
      </div>
    )}
    {activeTab === 'canvas' && (
      <div role="tabpanel" id="settings-canvas">
        <CanvasSettings />
      </div>
    )}
    {activeTab === 'notifications' && (
      <div
        role="tabpanel"
        id="settings-notifications">
        <NotificationSettings />
      </div>
    )}
  </div>
);
