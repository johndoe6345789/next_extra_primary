/**
 * Types for useCompose hook
 */

/** Email draft for composition */
export interface EmailDraft {
  id: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  htmlBody?: string
  attachments?: Array<{
    id: string
    filename: string
    mimeType: string
    size: number
  }>
  createdAt: number
  updatedAt: number
  isDraft: boolean
}

/** Return type of useCompose */
export interface UseComposeResult {
  /** Current draft */
  draft: EmailDraft | null
  /** Update draft values */
  updateDraft: (
    updates: Partial<
      Omit<
        EmailDraft,
        'id' | 'createdAt' | 'updatedAt'
      >
    >
  ) => void
  /** Clear current draft */
  clearDraft: () => void
  /** Save draft to server */
  saveDraft: () => Promise<void>
  /** Whether save is in progress */
  isSaving: boolean
  /** Error saving draft */
  error: Error | null
}

/** Internal compose state */
export interface ComposeState {
  draft: EmailDraft | null
  isSaving: boolean
  error: Error | null
}
