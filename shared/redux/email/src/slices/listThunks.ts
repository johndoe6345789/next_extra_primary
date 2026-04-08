/**
 * Email List Async Thunks
 * Fetch messages from the API
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import type { EmailMessage } from './listTypes'

/** @brief Fetch messages with filters */
export const fetchMessages = createAsyncThunk<
  { messages: EmailMessage[]; total: number },
  {
    folderId: string
    page?: number
    pageSize?: number
    filter?: string
    search?: string
    baseUrl?: string
  },
  { rejectValue: string }
>(
  'emailList/fetchMessages',
  async (params, { rejectWithValue }) => {
    const baseUrl = params.baseUrl ?? ''
    try {
      const query = new URLSearchParams({
        folderId: params.folderId,
        page: (params.page || 1).toString(),
        pageSize: (
          params.pageSize || 20
        ).toString(),
        ...(params.filter && {
          filter: params.filter,
        }),
        ...(params.search && {
          search: params.search,
        }),
      })
      const url =
        `${baseUrl}/api/v1/email/messages?${query}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(
          'Failed to fetch messages'
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
