/**
 * @file MailboxSidebar — folder list and Compose button.
 */
import React from 'react';
import type { MailboxSidebarProps } from './types';

const C = {
  bg: '#181c2e', active: '#252c45',
  border: '#2a2f45', text: '#c8cde8',
};

/** Sidebar folder navigation for the email client. */
export function MailboxSidebar({
  folders, onNavigate, onCompose,
}: MailboxSidebarProps) {
  return (
    <nav data-testid="mailbox-sidebar"
      aria-label="Folder navigation"
      style={{ display: 'flex', flexDirection: 'column',
        height: '100%', background: C.bg,
        borderRight: `1px solid ${C.border}`,
        paddingTop: 12 }}>
      <button aria-label="Compose new email"
        onClick={onCompose}
        style={{ margin: '0 12px 12px', padding: '10px 16px',
          borderRadius: 24, border: 'none',
          background: '#3d4d8a', color: '#e8ecfa',
          fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        + Compose
      </button>
      <ul role="list"
        style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {folders.map(f => (
          <li key={f.id}>
            <button
              aria-label={`${f.label}${
                f.unreadCount
                  ? `, ${f.unreadCount} unread` : ''}`}
              aria-current={f.isActive ? 'page' : undefined}
              onClick={() => onNavigate(f.id)}
              style={{ display: 'flex', alignItems: 'center',
                width: '100%', padding: '9px 16px',
                background: f.isActive ? C.active : 'none',
                border: 'none', cursor: 'pointer',
                color: f.isActive ? '#e8ecfa' : C.text,
                fontWeight: f.isActive ? 600 : 400,
                fontSize: 14, gap: 10, textAlign: 'left' }}>
              <span style={{ flex: 1 }}>{f.label}</span>
              {(f.unreadCount ?? 0) > 0 && (
                <span aria-hidden="true"
                  style={{ background: '#3d4d8a',
                    color: '#aab4d4',
                    borderRadius: 10, padding: '1px 7px',
                    fontSize: 11, fontWeight: 700 }}>
                  {f.unreadCount}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
