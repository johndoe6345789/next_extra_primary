/**
 * @file email/index.tsx
 * Public barrel for all email UI components.
 * MailboxLayout is defined here; all others are split
 * into dedicated files and re-exported below.
 */
import React from 'react';

/** Props for the top-level layout shell. */
interface LayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  main?: React.ReactNode;
  detail?: React.ReactNode;
}

const BODY_BG = '#1a1e30';
const BORDER = '#2a2f45';

/** Root layout: header + sidebar + main + optional detail. */
export function MailboxLayout({
  header,
  sidebar,
  main,
  detail,
}: LayoutProps) {
  return (
    <div
      data-testid="mailbox-layout"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: BODY_BG,
        overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0 }}>{header}</div>
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        borderTop: `1px solid ${BORDER}`,
      }}>
        <div style={{
          width: 220,
          flexShrink: 0,
          overflowY: 'auto',
        }}>
          {sidebar}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {main}
        </div>
        {detail && (
          <div style={{
            width: 420,
            flexShrink: 0,
            overflowY: 'auto',
          }}>
            {detail}
          </div>
        )}
      </div>
    </div>
  );
}

export { MailboxHeader } from './MailboxHeader';
export { MailboxSidebar } from './MailboxSidebar';
export { ThreadList } from './ThreadList';
export { EmailDetail } from './EmailDetail';
export { ComposeWindow } from './ComposeWindow';
export type {
  FolderNavigationItem,
  Email,
  MailboxHeaderProps,
  MailboxSidebarProps,
  ThreadListProps,
  EmailDetailProps,
  ComposeWindowProps,
  SendPayload,
} from './types';
