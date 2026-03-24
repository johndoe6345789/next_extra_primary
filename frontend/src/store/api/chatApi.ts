/**
 * Chat API endpoints injected into baseApi.
 * @module store/api/chatApi
 */
import { baseApi } from './baseApi';
import type { ChatMessage, ChatProvider, AiResponse } from '../../types/chat';
import type { PaginatedResponse } from '../../types/api';

/** Send message payload. */
interface SendMessageRequest {
  message: string;
  provider?: ChatProvider;
}

/** Chat send/history/clear endpoints. */
export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Send a message to the AI provider. */
    sendMessage: build.mutation<AiResponse, SendMessageRequest>({
      query: (body) => ({
        url: '/chat/messages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),

    /** Fetch paginated chat history. */
    getChatHistory: build.query<
      PaginatedResponse<ChatMessage>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 50 }) =>
        `/chat/history?page=${page}&per_page=${perPage}`,
      providesTags: ['Chat'],
    }),

    /** Clear all chat history. */
    clearHistory: build.mutation<void, void>({
      query: () => ({
        url: '/chat/history',
        method: 'DELETE',
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useClearHistoryMutation,
} = chatApi;
