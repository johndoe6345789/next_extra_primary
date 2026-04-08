/**
 * Types for useAccounts hook
 */

/** Email account configuration */
export interface EmailAccount {
  id: string
  accountName: string
  emailAddress: string
  protocol: 'imap' | 'pop3'
  hostname: string
  port: number
  encryption: 'none' | 'tls' | 'starttls'
  username: string
  isSyncEnabled: boolean
  syncInterval: number
  lastSyncAt: number | null
  isSyncing: boolean
  isEnabled: boolean
  unreadCount: number
  totalCount: number
}

/** Return type of useAccounts */
export interface UseAccountsResult {
  /** List of email accounts */
  accounts: EmailAccount[]
  /** Whether accounts are loading */
  loading: boolean
  /** Error loading accounts */
  error: Error | null
  /** Add a new email account */
  addAccount: (
    account: Omit<
      EmailAccount,
      'id' | 'unreadCount' | 'totalCount'
    >
  ) => Promise<EmailAccount>
  /** Delete an email account */
  deleteAccount: (
    id: string
  ) => Promise<void>
  /** Refresh account list */
  refresh: () => Promise<void>
}

/** Internal state */
export interface AccountState {
  accounts: EmailAccount[]
  loading: boolean
  error: Error | null
}
