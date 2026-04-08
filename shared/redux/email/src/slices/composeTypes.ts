/**
 * Email Compose Types
 * Shared types for draft and compose state
 */

/** @brief Single email draft */
export interface EmailDraft {
  id: string
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  textBody: string
  htmlBody?: string
  isDraft: boolean
  isSending: boolean
  createdAt: number
  updatedAt: number
  inReplyTo?: string
  attachmentIds?: string[]
}

/** @brief Redux state for email compose */
export interface ComposeDraftState {
  currentDraft: EmailDraft | null
  drafts: EmailDraft[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
  successMessage: string | null
}

/** @brief Initial compose state */
export const composeInitialState: ComposeDraftState = {
  currentDraft: null,
  drafts: [],
  isLoading: false,
  isSaving: false,
  error: null,
  successMessage: null,
}
