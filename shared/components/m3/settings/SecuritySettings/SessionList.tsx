'use client';

import React from 'react';

interface Session {
  id: string;
  device: string;
  lastActive: string;
  isCurrent: boolean;
}

interface SessionListProps {
  sessions: Session[];
  onSignOut: (sessionId: string) => void;
}

/**
 * Renders a list of active sessions with
 * sign-out actions for non-current sessions.
 */
export const SessionList: React.FC<
  SessionListProps
> = ({ sessions, onSignOut }) => (
  <>
    {sessions.map((session) => (
      <div key={session.id}>
        <div>
          <p>{session.device}</p>
          <p>
            Last active: {session.lastActive}
          </p>
        </div>
        {session.isCurrent ? (
          <span>Current</span>
        ) : (
          <button
            className={''}
            onClick={() =>
              onSignOut(session.id)
            }
          >
            Sign Out
          </button>
        )}
      </div>
    ))}
  </>
);

export default SessionList;
