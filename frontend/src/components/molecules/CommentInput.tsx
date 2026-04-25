'use client';

import { Icon } from '@shared/m3/data-display/Icon';
import {
  inputRow, inputStyle, btnStyle,
} from '../organisms/profileActivityStyles';

/** Props for the CommentInput molecule. */
export interface CommentInputProps {
  /** Current draft text. */
  draft: string;
  /** Draft text setter. */
  setDraft: (v: string) => void;
  /** Submit handler. */
  onPost: () => void;
}

/**
 * Input field with send button for posting
 * a new comment.
 */
export default function CommentInput({
  draft, setDraft, onPost,
}: CommentInputProps) {
  return (
    <div style={inputRow}>
      <input
        style={inputStyle}
        placeholder="Write a comment..."
        value={draft}
        onChange={(e) =>
          setDraft(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          onPost();
        }}
        data-testid="comment-input"
        aria-label="Write a comment"
      />
      <button
        style={btnStyle}
        onClick={onPost}
        disabled={!draft.trim()}
        data-testid="comment-submit"
        aria-label="Post comment"
      >
        <Icon size="sm" color="primary">
          send
        </Icon>
      </button>
    </div>
  );
}
