/**
 * Email Compose Async Thunks
 * Save draft operation
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import type { EmailDraft } from './composeTypes'

export {
  sendEmailAsync,
  fetchDrafts,
} from './composeSendThunk'

/** @brief Save draft to server */
export const saveDraftAsync = createAsyncThunk<
  EmailDraft,
  { draft: EmailDraft; baseUrl?: string },
  { rejectValue: string }
>(
  'emailCompose/saveDraftAsync',
  async (
    { draft, baseUrl = '' },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/email/drafts`,
        {
          method: draft.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(draft),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to save draft')
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Unknown error occurred'
      )
    }
  }
)
