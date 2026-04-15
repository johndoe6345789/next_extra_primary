/**
 * Shared prop interfaces for email UI components.
 */

/** A mail folder shown in the sidebar. */
export interface FolderNavigationItem {
  /** Unique folder identifier. */
  id: string;
  /** Display label. */
  label: string;
  /** Material Symbols icon name. */
  icon?: string;
  /** Number of unread messages. */
  unreadCount?: number;
  /** Whether this folder is currently active. */
  isActive?: boolean;
}

/** A single email message. */
export interface Email {
  id: string;
  testId: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  preview: string;
  receivedAt: number;
  isRead: boolean;
  isStarred: boolean;
  body: string;
}

/** Props for MailboxHeader. */
export interface MailboxHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onMenuClick: () => void;
  onSettingsClick: () => void;
  onAlertsClick: () => void;
  alertCount: number;
  locale: string;
  onCycleLocale: () => void;
}

/** Props for MailboxSidebar. */
export interface MailboxSidebarProps {
  folders: FolderNavigationItem[];
  onNavigate: (folderId: string) => void;
  onCompose: () => void;
}

/** Props for ThreadList. */
export interface ThreadListProps {
  emails: Email[];
  selectedEmailId?: string;
  onSelectEmail: (id: string) => void;
  onToggleRead: (id: string, read: boolean) => void;
  onToggleStar: (id: string, starred: boolean) => void;
}

/** Props for EmailDetail. */
export interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onReply: () => void;
  onForward: () => void;
  onToggleStar: (starred: boolean) => void;
}

/** Payload sent when composing a message. */
export interface SendPayload {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
}

/** Props for ComposeWindow. */
export interface ComposeWindowProps {
  onSend: (data: SendPayload) => void;
  onClose: () => void;
}
