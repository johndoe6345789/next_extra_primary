/**
 * @file ComposeWindow — floating email compose form.
 */
import React, { useState } from 'react';
import type { ComposeWindowProps } from './types';

const C = {
  bg: '#1e2235', bar: '#181c2e',
  border: '#2a2f45', text: '#c8cde8',
  inputBg: '#151929', muted: '#6b7090',
};
const field: React.CSSProperties = {
  background: C.inputBg, border: `1px solid ${C.border}`,
  borderRadius: 6, color: C.text, fontSize: 13,
  padding: '7px 10px', outline: 'none',
  width: '100%', boxSizing: 'border-box',
};

/** Floating compose window for drafting a new email. */
export function ComposeWindow({ onSend, onClose }: ComposeWindowProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  function handleSend() {
    onSend({
      to: to.split(',').map(s => s.trim()).filter(Boolean),
      subject,
      body,
    });
  }

  return (
    <div data-testid="compose-window"
      aria-label="Compose new email" role="dialog"
      aria-modal="true"
      style={{ position: 'fixed', bottom: 24, right: 24,
        width: 480, maxWidth: 'calc(100vw - 48px)',
        background: C.bg, border: `1px solid ${C.border}`,
        borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,.6)',
        display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center',
        padding: '10px 14px',
        borderBottom: `1px solid ${C.border}`,
        background: C.bar,
        borderRadius: '10px 10px 0 0' }}>
        <span style={{ flex: 1, fontWeight: 600,
          color: C.text, fontSize: 14 }}>
          New Message
        </span>
        <button aria-label="Close compose window"
          onClick={onClose}
          style={{ background: 'none', border: 'none',
            cursor: 'pointer', color: C.muted, fontSize: 16,
            padding: '2px 6px' }}>
          ✕
        </button>
      </div>
      <div style={{ padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input aria-label="To"
          placeholder="To (comma-separated)"
          value={to} onChange={e => setTo(e.target.value)}
          style={field} />
        <input aria-label="Subject" placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          style={field} />
        <textarea aria-label="Message body"
          placeholder="Write your message…"
          value={body} rows={8}
          onChange={e => setBody(e.target.value)}
          style={{ ...field, resize: 'vertical',
            fontFamily: 'inherit', lineHeight: 1.5 }} />
      </div>
      <div style={{ display: 'flex', gap: 8,
        padding: '8px 14px 14px' }}>
        <button aria-label="Send email" onClick={handleSend}
          style={{ padding: '8px 22px', borderRadius: 6,
            border: 'none', background: '#3d4d8a',
            color: '#e8ecfa', fontWeight: 600,
            fontSize: 14, cursor: 'pointer' }}>
          Send
        </button>
        <button aria-label="Discard draft" onClick={onClose}
          style={{ padding: '8px 16px', borderRadius: 6,
            border: `1px solid ${C.border}`, background: 'none',
            color: C.text, fontSize: 14, cursor: 'pointer' }}>
          Discard
        </button>
      </div>
    </div>
  );
}
