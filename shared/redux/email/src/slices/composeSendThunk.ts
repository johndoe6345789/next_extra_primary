/**
 * Send Email Async Thunk
 * Handles sending email via API
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import type { EmailDraft } from './composeTypes'

/** @brief Send email via API */
export const sendEmailAsync = createAsyncThunk<
  { success: boolean; messageId: string },
  { draft: EmailDraft; baseUrl?: string },
  { rejectValue: string }
>(
  'emailCompose/sendEmailAsync',
  async (
    { draft, baseUrl = '' },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/email/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...draft,
            isDraft: false,
            isSending: true,
          }),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to send email')
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

/** @brief Fetch all drafts from API */
export const fetchDrafts = createAsyncThunk<
  EmailDraft[],
  { baseUrl?: string } | void,
  { rejectValue: string }
>(
  'emailCompose/fetchDrafts',
  async (arg, { rejectWithValue }) => {
    const baseUrl =
      arg && 'baseUrl' in arg
        ? (arg.baseUrl ?? '')
        : ''
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/email/drafts`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch drafts')
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
