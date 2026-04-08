/**
 * Props definition for ChatInput component.
 * @module components/organisms/ChatInputProps
 */
import type { ChatProvider } from '@/types/chat';

/** Props for ChatInput sub-component. */
export interface ChatInputProps {
  /** Current text. */
  value: string;
  /** Text change handler. */
  onChange: (v: string) => void;
  /** Send handler. */
  onSend: () => void;
  /** Active provider. */
  provider: ChatProvider;
  /** Provider change handler. */
  onProvider: (p: ChatProvider) => void;
  /** Disable send. */
  disabled: boolean;
}
