/**
 * Chat slice — messages, streaming state, provider.
 * @module store/slices/chatSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  ChatProvider,
  type ChatMessage,
  type ChatState,
} from '../../types/chat';

const initialState: ChatState = {
  messages: [],
  isStreaming: false,
  activeProvider: ChatProvider.OpenAI,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /** Append a chat message. */
    addMessage(
      state,
      action: PayloadAction<ChatMessage>,
    ) {
      state.messages.push(action.payload);
    },
    /** Set whether a response is streaming. */
    setStreaming(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.isStreaming = action.payload;
    },
    /** Switch the active AI provider. */
    setProvider(
      state,
      action: PayloadAction<ChatProvider>,
    ) {
      state.activeProvider = action.payload;
    },
    /** Clear all messages from state. */
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  setStreaming,
  setProvider,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
