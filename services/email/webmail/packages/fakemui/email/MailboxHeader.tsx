/**
 * @file MailboxHeader — top bar content for
 * the email client. Renders inside M3 AppBar.
 */
import React from 'react';
import type { MailboxHeaderProps } from './types';

const btn: React.CSSProperties = {
  background: 'none', border: 'none',
  cursor: 'pointer', fontSize: 18,
  color: 'var(--mat-sys-on-surface)',
  padding: '4px 8px', borderRadius: 8,
};

const badge: React.CSSProperties = {
  position: 'absolute', top: 2, right: 2,
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary)',
  borderRadius: '50%', width: 16, height: 16,
  fontSize: 10, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  pointerEvents: 'none',
};

/** Top header bar content for the email client. */
export function MailboxHeader({
  searchQuery, onSearchChange,
  isDarkMode, onToggleTheme,
  onMenuClick, alertCount,
}: MailboxHeaderProps) {
  return (
    <>
      <button aria-label="Toggle sidebar menu"
        onClick={onMenuClick} style={btn}>☰
      </button>
      <span style={{
        fontWeight: 700, fontSize: 16,
        color: 'var(--mat-sys-on-surface)',
        marginRight: 8, whiteSpace: 'nowrap',
      }}>
        Nextra Mail
      </span>
      <input aria-label="Search mail"
        placeholder="Search…" value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        style={{
          flex: 1, maxWidth: 400,
          padding: '6px 12px', borderRadius: 20,
          border: '1px solid var(--mat-sys-outline)',
          background:
            'var(--mat-sys-surface-container-high)',
          color: 'var(--mat-sys-on-surface)',
          fontSize: 14, outline: 'none',
        }} />
      <span style={{ flex: 1 }} />
      <button aria-label="Toggle theme"
        onClick={onToggleTheme}
        title={isDarkMode ? 'Light mode' : 'Dark mode'}
        style={btn}>
        {isDarkMode ? '☀' : '🌙'}
      </button>
      <div style={{ position: 'relative' }}>
        <button
          aria-label={`Alerts: ${alertCount} unread`}
          style={btn}>🔔
        </button>
        {alertCount > 0 && (
          <span aria-hidden="true" style={badge}>
            {alertCount > 99 ? '99+' : alertCount}
          </span>
        )}
      </div>
    </>
  );
}
