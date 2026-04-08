/**
 * Header sub-components for the Styles Panel.
 */

import React from 'react';

export { CSSView, SchemaView }
  from './StylesPanelCodeViews';

/** V1/V2 version badge. */
export const VersionBadge: React.FC<{
  isV2: boolean;
}> = ({ isV2 }) => (
  <span style={{
    marginLeft: '0.5rem',
    fontSize: '10px',
    padding: '2px 6px',
    background: isV2 ? '#22c55e' : '#f59e0b',
    color: 'white',
    borderRadius: '3px',
  }}>
    {isV2 ? 'V2' : 'V1'}
  </span>
);

/** Toggle button props. */
interface ViewToggleProps {
  view: 'css' | 'schema';
  setView: (v: 'css' | 'schema') => void;
}

/** CSS/Schema view toggle buttons. */
export const ViewToggle: React.FC<
  ViewToggleProps
> = ({ view, setView }) => (
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <ToggleButton
      active={view === 'css'}
      onClick={() => setView('css')}
      label="Compiled CSS"
    />
    <ToggleButton
      active={view === 'schema'}
      onClick={() => setView('schema')}
      label="Schema"
    />
  </div>
);

/** Individual toggle button. */
const ToggleButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      padding: '4px 12px',
      background: active ? '#3b82f6' : '#e5e7eb',
      color: active ? 'white' : 'black',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);
