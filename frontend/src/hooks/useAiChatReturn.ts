/**
 * Return type for the useAiChat hook.
 * @module hooks/useAiChatReturn
 */
import type {
  ChatMessage, ChatProvider,
} from '@/types/chat';

/** Chat state and action helpers. */
export interface UseAiChatReturn {
  /** Chronological list of chat messages. */
  messages: ChatMessage[];
  /** Send a message to the active provider. */
  sendMessage: (c: string) => Promise<void>;
  /** Whether a response is streaming. */
  isStreaming: boolean;
  /** The active AI provider. */
  provider: ChatProvider;
  /** Change the active AI provider. */
  setProvider: (p: ChatProvider) => void;
  /** Clear the entire chat history. */
  clearHistory: () => Promise<void>;
  /** Whether history data is loading. */
  isLoading: boolean;
  /** User-friendly error or null. */
  error: string | null;
  /** Dismiss the current error. */
  clearError: () => void;
}
