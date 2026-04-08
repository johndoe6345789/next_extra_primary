/**
 * Email Detail Async Thunks
 * Fetch email detail and thread
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
  EmailDetail,
  ThreadMessage,
} from './detailTypes'

/** @brief Fetch email details by ID */
export const fetchEmailDetail = createAsyncThunk<
  EmailDetail,
  { messageId: string; baseUrl?: string },
  { rejectValue: string }
>(
  'emailDetail/fetchEmailDetail',
  async (
    { messageId, baseUrl = '' },
    { rejectWithValue }
  ) => {
    try {
      const url =
        `${baseUrl}/api/v1/email/messages/${messageId}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(
          'Failed to fetch email details'
        )
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

/** @brief Fetch conversation thread */
export const fetchConversationThread =
  createAsyncThunk<
    ThreadMessage[],
    {
      conversationId: string
      baseUrl?: string
    },
    { rejectValue: string }
  >(
    'emailDetail/fetchConversationThread',
    async (
      { conversationId, baseUrl = '' },
      { rejectWithValue }
    ) => {
      try {
        const url =
          `${baseUrl}/api/v1/email/conversations/${conversationId}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(
            'Failed to fetch conversation thread'
          )
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
