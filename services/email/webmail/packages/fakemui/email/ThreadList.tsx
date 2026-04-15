/** @file ThreadList — scrollable list of email thread rows. */
import React from 'react';
import type { ThreadListProps } from './types';

const C = {
  bg: '#1e2235', sel: '#252c45', border: '#2a2f45',
  text: '#c8cde8', muted: '#6b7090', unread: '#e8ecfa',
};
const miniBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#6b7090', fontSize: 14, padding: '2px 4px',
};

function fmtDate(ts: number): string {
  const d = new Date(ts);
  const n = new Date();
  const today = d.toDateString() === n.toDateString();
  return today
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Scrollable list of email thread rows. */
export function ThreadList({
  emails, selectedEmailId,
  onSelectEmail, onToggleRead, onToggleStar,
}: ThreadListProps) {
  return (
    <ul data-testid="thread-list" aria-label="Email list"
      role="list"
      style={{ listStyle: 'none', margin: 0, padding: 0,
        overflowY: 'auto', height: '100%', background: C.bg }}>
      {emails.map(e => (
        <li key={e.id}
          data-testid={`thread-row-${e.testId}`}
          style={{ background: e.id === selectedEmailId
            ? C.sel : C.bg,
            borderBottom: `1px solid ${C.border}` }}>
          <button
            aria-label={`Email from ${e.from}: ${e.subject}`}
            onClick={() => onSelectEmail(e.id)}
            style={{ display: 'flex', flexDirection: 'column',
              width: '100%', padding: '10px 14px 4px',
              background: 'none', border: 'none',
              cursor: 'pointer', textAlign: 'left', gap: 3 }}>
            <div style={{ display: 'flex',
              justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontWeight: e.isRead ? 400 : 700,
                color: e.isRead ? C.text : C.unread,
                fontSize: 13, overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', flex: 1 }}>
                {e.from}
              </span>
              <span style={{ fontSize: 11, color: C.muted,
                whiteSpace: 'nowrap' }}>
                {fmtDate(e.receivedAt)}
              </span>
            </div>
            <span style={{ fontSize: 13,
              color: e.isRead ? C.muted : C.text,
              fontWeight: e.isRead ? 400 : 600,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}>
              {e.subject}
            </span>
            <span style={{ fontSize: 12, color: C.muted,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}>
              {e.preview}
            </span>
          </button>
          <div style={{ display: 'flex', gap: 4,
            padding: '0 10px 6px' }}>
            <button
              aria-label={e.isStarred ? 'Unstar' : 'Star'}
              onClick={ev => {
                ev.stopPropagation();
                onToggleStar(e.id, !e.isStarred);
              }}
              style={miniBtn}>
              {e.isStarred ? '★' : '☆'}
            </button>
            <button
              aria-label={e.isRead
                ? 'Mark as unread' : 'Mark as read'}
              onClick={ev => {
                ev.stopPropagation();
                onToggleRead(e.id, !e.isRead);
              }}
              style={miniBtn}>
              {e.isRead ? '◉' : '●'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
