/**
 * Chat and AI messaging type definitions.
 * @module types/chat
 */

/** Available AI chat providers. */
export enum ChatProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Local = 'local',
}

/** A single chat message. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider: ChatProvider;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/** Structured AI response from the backend. */
export interface AiResponse {
  id: string;
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'error';
}

/** Redux chat slice state shape. */
export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  activeProvider: ChatProvider;
}
