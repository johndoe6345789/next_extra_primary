/**
 * Barrel export for all organism components.
 * @module components/organisms
 */

export { Navbar } from './Navbar';
export type { NavbarProps } from './Navbar';

export { Footer } from './Footer';
export type {
  FooterProps,
  FooterLink,
} from '@shared/components/ui/Footer';

export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm';

export { RegisterForm } from './RegisterForm';
export type { RegisterFormProps } from './RegisterForm';

export { HeroSection } from './HeroSection';
export type { HeroSectionProps } from './HeroSection';

export { FeatureGrid } from '@shared/ui';
export type { FeatureGridProps }
  from '@shared/ui';

export { LeaderboardTable } from './LeaderboardTable';
export type { LeaderboardTableProps } from './LeaderboardTable';

export { BadgeShowcase } from './BadgeShowcase';
export type { BadgeShowcaseProps } from './BadgeShowcase';

export { NotificationPanel } from './NotificationPanel';
export type { NotificationPanelProps } from './NotificationPanel';

export { ChatPanel } from './ChatPanel';
export type { ChatPanelProps } from './ChatPanel';

export { AiChatMessage } from './AiChatMessage';
export type { AiChatMessageProps } from './AiChatMessage';

export { DashboardShortcuts } from './DashboardShortcuts';
export type { DashboardShortcutsProps } from './DashboardShortcuts';

export { ShortcutCheatSheet } from './ShortcutCheatSheet';
export type { ShortcutCheatSheetProps } from './ShortcutCheatSheet';

export { ContactForm } from './ContactForm';
export type { ContactFormProps } from './ContactForm';

export { ForgotPasswordForm } from './ForgotPasswordForm';
export type { ForgotPasswordFormProps } from './ForgotPasswordForm';

export { default as DashboardStats }
  from './DashboardStats';

export { default as DashboardGrid }
  from './DashboardGrid';

export { default as ProfileContent }
  from './ProfileContent';
export { default as ProfileHeader }
  from './ProfileHeader';
export { default as ProfileBadges }
  from './ProfileBadges';
export { default as ProfileActivity }
  from './ProfileActivity';

export { ErrorBoundary } from './ErrorBoundary';
export { default as AdminDebugPanel }
  from './AdminDebugPanel';

export {
  SettingsCard, SettingsRow,
} from './SettingsCard';
export type {
  SettingsCardProps, SettingsRowProps,
} from './SettingsCard';
export { default as SettingsAdminCard }
  from './SettingsAdminCard';
export { default as SettingsPreferences }
  from './SettingsPreferences';

export { NotifPrefTable } from './NotifPrefTable';
export type {
  NotifPrefTableProps,
} from './NotifPrefTable';
