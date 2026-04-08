'use client';
/**
 * SessionManagementSettings Component
 * Active session management and logout control
 */

import React from 'react';
import { SessionList } from './SessionList';
import { useSessionManagement }
  from './useSessionManagement';

interface SessionManagementSettingsProps {
  onSessionsCleared?: () => void;
  testId?: string;
}

/**
 * Active sessions panel with sign-out controls.
 */
export const SessionManagementSettings: React.FC<
  SessionManagementSettingsProps
> = ({ onSessionsCleared, testId }) => {
  const sm = useSessionManagement(
    onSessionsCleared
  );

  return (
    <div data-testid={testId}>
      <h3>Active Sessions</h3>
      <p>
        Manage your active sessions across
        devices
      </p>
      <SessionList
        sessions={sm.sessions}
        onSignOut={sm.handleSignOutSession} />
      <button className={''}
        onClick={sm.handleSignOutAll}
        disabled={
          sm.isClearing || sm.otherCount === 0}>
        {sm.isClearing
          ? 'Signing Out...'
          : 'Sign Out All Other Sessions'}
      </button>
    </div>
  );
};

export default SessionManagementSettings;
