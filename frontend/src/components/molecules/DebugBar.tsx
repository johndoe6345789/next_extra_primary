'use client';

import React, { useState } from 'react';
import { useDebugPanel } from
  '@/hooks/useDebugPanel';
import { debugBarStyles as S } from
  './debugBarStyles';

/**
 * Persistent debug bar fixed to the bottom of
 * the viewport. Shows auth state, last API call,
 * and environment at a glance. Click to expand
 * the full API call log.
 */
export const DebugBar: React.FC = () => {
  const { entries, auth, env } = useDebugPanel();
  const [open, setOpen] = useState(false);
  const last = entries[0];

  return (
    <div style={S.root} data-testid="debug-bar">
      <div
        style={S.summary}
        onClick={() => setOpen(!open)}
        role="button" tabIndex={0}
        aria-label="Toggle debug panel"
        onKeyDown={(e) => {
          if (e.key === 'Enter') setOpen(!open);
        }}
      >
        <span style={S.badge(auth.isAuthenticated)}>
          {auth.isAuthenticated
            ? auth.role : 'anon'}
        </span>
        <span style={S.env}>
          {env.nodeEnv}
        </span>
        {last && (
          <span style={S.api}>
            <span style={S.method}>
              {last.method}
            </span>
            <span style={S.url}>
              {last.url}
            </span>
            <span style={S.status(last.status)}>
              {last.status}
            </span>
            <span style={S.dur}>
              {last.duration}ms
            </span>
          </span>
        )}
        <span style={S.toggle}>
          {open ? '▼' : '▲'} {entries.length}
        </span>
      </div>
      {open && (
        <div style={S.log}>
          {entries.map((e, i) => (
            <div key={`${e.requestId}-${i}`}
              style={S.row}>
              <span style={S.ts}>
                {e.timestamp.slice(11, 19)}
              </span>
              <span style={S.method}>
                {e.method}
              </span>
              <span style={S.url}>{e.url}</span>
              <span style={S.status(e.status)}>
                {e.status}
              </span>
              <span style={S.dur}>
                {e.duration}ms
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebugBar;
