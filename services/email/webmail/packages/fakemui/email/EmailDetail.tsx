/**
 * @file EmailDetail — full email view with action buttons.
 */
import React from 'react';
import type { EmailDetailProps } from './types';

const C = {
  bg: '#1e2235', border: '#2a2f45',
  text: '#c8cde8', muted: '#6b7090', subj: '#e8ecfa',
};
const aBtn: React.CSSProperties = {
  background: 'none', border: `1px solid ${C.border}`,
  borderRadius: 6, cursor: 'pointer',
  color: C.text, fontSize: 12, padding: '4px 10px',
};

/** Full email view with reply / forward / archive / delete. */
export function EmailDetail({
  email, onClose, onArchive, onDelete,
  onReply, onForward, onToggleStar,
}: EmailDetailProps) {
  return (
    <article data-testid="email-detail"
      aria-label={`Email: ${email.subject}`}
      style={{ display: 'flex', flexDirection: 'column',
        height: '100%', background: C.bg,
        borderLeft: `1px solid ${C.border}`,
        color: C.text, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center',
        gap: 6, padding: '8px 12px', flexShrink: 0,
        borderBottom: `1px solid ${C.border}` }}>
        <button aria-label="Reply"
          onClick={onReply} style={aBtn}>↩ Reply</button>
        <button aria-label="Forward"
          onClick={onForward} style={aBtn}>↪ Fwd</button>
        <button aria-label="Archive"
          onClick={onArchive} style={aBtn}>📦</button>
        <button aria-label="Delete" onClick={onDelete}
          style={{ ...aBtn, color: '#e07070' }}>🗑</button>
        <span style={{ flex: 1 }} />
        <button
          aria-label={email.isStarred ? 'Unstar' : 'Star'}
          onClick={() => onToggleStar(!email.isStarred)}
          style={{ ...aBtn, fontSize: 18, border: 'none' }}>
          {email.isStarred ? '★' : '☆'}
        </button>
        <button aria-label="Close email"
          onClick={onClose} style={aBtn}>✕</button>
      </div>
      <div style={{ padding: '14px 16px 10px', flexShrink: 0,
        borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ margin: '0 0 10px', fontSize: 18,
          fontWeight: 700, color: C.subj }}>
          {email.subject}
        </h2>
        {[
          ['From', email.from],
          ['To', email.to.join(', ')],
          ...(email.cc ? [['Cc', email.cc.join(', ')]] : []),
          ['Date', new Date(email.receivedAt).toLocaleString()],
        ].map(([k, v]) => (
          <div key={k} style={{ fontSize: 13, color: C.muted }}>
            <strong style={{ color: C.text }}>{k}:</strong>
            {' '}{v}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16,
        fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
        {email.body}
      </div>
    </article>
  );
}
