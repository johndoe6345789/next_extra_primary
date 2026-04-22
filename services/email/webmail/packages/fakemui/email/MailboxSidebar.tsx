/**
 * @file MailboxSidebar — M3-themed nav drawer.
 * Shows portal link, compose, folders, theme toggle.
 */
import React from 'react';
import type { MailboxSidebarProps } from './types';

const V = {
  surface: 'var(--mat-sys-surface-container)',
  text: 'var(--mat-sys-on-surface)',
  muted: 'var(--mat-sys-on-surface-variant)',
  primary: 'var(--mat-sys-primary)',
  onPrimary: 'var(--mat-sys-on-primary)',
  border: 'var(--mat-sys-outline-variant)',
  active: 'var(--mat-sys-secondary-container)',
  onActive: 'var(--mat-sys-on-secondary-container)',
};

const icon: React.CSSProperties = {
  fontFamily: 'Material Symbols Outlined',
  fontSize: 20, lineHeight: 1,
  fontVariationSettings: "'FILL' 0,'wght' 400",
  userSelect: 'none',
};

const rowBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  width: '100%', padding: '10px 16px',
  background: 'none', border: 'none',
  cursor: 'pointer', fontSize: 14,
  color: V.text, textAlign: 'left',
};

/** Sidebar drawer content for the mail client. */
export function MailboxSidebar({
  folders, onNavigate, onCompose,
  onClose, isDarkMode, onToggleTheme,
}: MailboxSidebarProps) {
  return (
    <nav data-testid="mailbox-sidebar"
      aria-label="Mail navigation"
      style={{ display: 'flex', flexDirection: 'column',
        height: '100%', background: V.surface,
        borderRight: `1px solid ${V.border}` }}>

      {/* Drawer header */}
      <div style={{ display: 'flex',
        alignItems: 'center', padding: '12px 16px',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${V.border}` }}>
        <span style={{ fontWeight: 700, fontSize: 15,
          color: V.text }}>Nextra Mail</span>
        <button aria-label="Close menu"
          onClick={onClose}
          style={{ background: 'none', border: 'none',
            cursor: 'pointer', color: V.muted,
            fontSize: 18, padding: '2px 6px',
            borderRadius: 6 }}>✕</button>
      </div>

      {/* Back to main portal */}
      <a href="/app/en"
        style={{ display: 'flex', alignItems: 'center',
          gap: 12, padding: '12px 16px',
          textDecoration: 'none', color: V.text,
          fontSize: 14, fontWeight: 500,
          borderBottom: `1px solid ${V.border}` }}>
        <span style={icon}>arrow_back</span>
        Back to Nextra
      </a>

      {/* Compose */}
      <div style={{ padding: '12px 16px' }}>
        <button aria-label="Compose new email"
          onClick={onCompose}
          style={{ width: '100%', padding: '10px 16px',
            borderRadius: 20, border: 'none',
            background: V.primary, color: V.onPrimary,
            fontWeight: 600, fontSize: 14,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: 8 }}>
          <span style={icon}>edit</span>
          Compose
        </button>
      </div>

      {/* Folder list */}
      <ul role="list" style={{ listStyle: 'none',
        margin: 0, padding: 0, flex: 1,
        overflowY: 'auto' }}>
        {folders.map(f => (
          <li key={f.id}>
            <button
              aria-label={`${f.label}${
                f.unreadCount
                  ? `, ${f.unreadCount} unread` : ''}`}
              aria-current={f.isActive ? 'page' : undefined}
              onClick={() => onNavigate(f.id)}
              style={{ ...rowBtn,
                background: f.isActive ? V.active : 'none',
                color: f.isActive ? V.onActive : V.text,
                fontWeight: f.isActive ? 600 : 400 }}>
              {f.icon && (
                <span style={icon}>{f.icon}</span>
              )}
              <span style={{ flex: 1 }}>{f.label}</span>
              {(f.unreadCount ?? 0) > 0 && (
                <span aria-hidden="true" style={{
                  background: V.primary,
                  color: V.onPrimary,
                  borderRadius: 10, padding: '1px 7px',
                  fontSize: 11, fontWeight: 700 }}>
                  {f.unreadCount}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Footer: theme toggle */}
      <div style={{ padding: '12px 16px',
        borderTop: `1px solid ${V.border}` }}>
        <button aria-label="Toggle theme"
          onClick={onToggleTheme}
          style={{ ...rowBtn, padding: 0, gap: 8 }}>
          <span style={icon}>
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          {isDarkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </nav>
  );
}
