'use client';

import React from 'react';
import { testId } from './accessibility';

type SettingsTab =
  | 'account'
  | 'security'
  | 'canvas'
  | 'notifications';

interface SettingsTabNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const TABS: Array<{
  key: SettingsTab;
  label: string;
  controlsId: string;
}> = [
  {
    key: 'account',
    label: 'Account',
    controlsId: 'settings-account',
  },
  {
    key: 'security',
    label: 'Security',
    controlsId: 'settings-security',
  },
  {
    key: 'canvas',
    label: 'Canvas',
    controlsId: 'settings-canvas',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    controlsId: 'settings-notifications',
  },
];

/**
 * Tab navigation bar for the settings modal.
 */
export const SettingsTabNav: React.FC<
  SettingsTabNavProps
> = ({ activeTab, onTabChange }) => (
  <div
    role="tablist"
    aria-label="Settings sections"
  >
    {TABS.map((tab) => (
      <button
        key={tab.key}
        className={''}
        onClick={() => onTabChange(tab.key)}
        role="tab"
        aria-selected={activeTab === tab.key}
        aria-controls={tab.controlsId}
        data-testid={testId.navTab(tab.label)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default SettingsTabNav;
