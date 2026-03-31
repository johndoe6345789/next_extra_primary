/**
 * @file MailboxHeader — top bar: title, search, theme, alerts.
 */
import React from 'react';
import type { MailboxHeaderProps } from './types';

const s = {
  bar: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 16px', height: 56,
    background: '#151929',
    borderBottom: '1px solid #2a2f45',
    color: '#c8cde8',
  } as React.CSSProperties,
  title: { fontWeight: 700, fontSize: 16, color: '#c8cde8' },
  search: {
    flex: 1, maxWidth: 400, padding: '6px 12px',
    borderRadius: 20, border: '1px solid #2a2f45',
    background: '#1e2235', color: '#c8cde8',
    fontSize: 14, outline: 'none',
  } as React.CSSProperties,
  spacer: { flex: 1 } as React.CSSProperties,
  btn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 18, color: '#c8cde8', padding: '4px 6px',
    borderRadius: 6,
  } as React.CSSProperties,
  badge: {
    position: 'absolute', top: 2, right: 2,
    background: '#7c8fcb', color: '#fff', borderRadius: '50%',
    width: 16, height: 16, fontSize: 10,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', pointerEvents: 'none',
  } as React.CSSProperties,
};

/** Top header bar for the email client. */
export function MailboxHeader({
  searchQuery, onSearchChange,
  isDarkMode, onToggleTheme,
  onMenuClick, alertCount,
}: MailboxHeaderProps) {
  return (
    <header data-testid="mailbox-header"
      aria-label="Mail header" style={s.bar}>
      <button aria-label="Toggle sidebar menu"
        onClick={onMenuClick} style={s.btn}>☰</button>
      <span style={s.title}>Nextra Mail</span>
      <input aria-label="Search mail"
        placeholder="Search…" value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        style={s.search} />
      <span style={s.spacer} />
      <button aria-label="Toggle theme"
        onClick={onToggleTheme} style={s.btn}
        title={isDarkMode ? 'Light mode' : 'Dark mode'}>
        {isDarkMode ? '☀' : '🌙'}
      </button>
      <div style={{ position: 'relative' }}>
        <button
          aria-label={`Alerts: ${alertCount} unread`}
          style={s.btn}>🔔</button>
        {alertCount > 0 && (
          <span aria-hidden="true" style={s.badge}>
            {alertCount > 99 ? '99+' : alertCount}
          </span>
        )}
      </div>
    </header>
  );
}
