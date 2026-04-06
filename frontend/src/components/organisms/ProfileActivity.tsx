'use client';

import { useState } from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import { Icon } from '@shared/m3/data-display/Icon';
import { useAuth } from '@/hooks';
import {
  useListCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '@/store/api';
import CommentRow from '../molecules/CommentRow';

/**
 * Activity feed backed by the comments API.
 * Authenticated users can post and delete their
 * own comments.
 */
export default function ProfileActivity() {
  const { user } = useAuth();
  const { data: comments = [] } =
    useListCommentsQuery({ limit: 50, offset: 0 });
  const [create] = useCreateCommentMutation();
  const [remove] = useDeleteCommentMutation();
  const [draft, setDraft] = useState('');

  const post = async () => {
    if (!draft.trim() || !user) return;
    await create({ content: draft.trim() });
    setDraft('');
  };

  return (
    <Card data-testid="profile-activity">
      <CardContent>
        <Typography variant="h6"
          style={{ marginBottom: 16 }}
        >
          Activity
        </Typography>
        <div style={inputRow}>
          <input
            style={inputStyle}
            placeholder="Write a comment..."
            value={draft}
            onChange={(e) =>
              setDraft(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' && post()
            }
            data-testid="comment-input"
            aria-label="Write a comment"
          />
          <button
            style={btnStyle}
            onClick={post}
            disabled={!draft.trim()}
            data-testid="comment-submit"
            aria-label="Post comment"
          >
            <Icon size="sm" color="primary">
              send
            </Icon>
          </button>
        </div>
        {comments.length === 0 ? (
          <Typography variant="body2"
            color="textSecondary"
            style={{ marginTop: 12 }}
          >
            No activity yet. Be the first to post!
          </Typography>
        ) : (
          comments.map((c) => (
            <CommentRow key={c.id}
              id={c.id} content={c.content}
              username={c.username}
              displayName={c.displayName}
              createdAt={c.createdAt}
              mine={c.username === user?.username}
              onDelete={() => remove(c.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

const inputRow: React.CSSProperties = {
  display: 'flex', gap: 8, alignItems: 'center',
  marginBottom: 16,
};
const inputStyle: React.CSSProperties = {
  flex: 1, padding: '12px 16px',
  borderRadius: 24, fontSize: 14,
  border: '2px solid var(--mat-sys-outline)',
  background:
    'var(--mat-sys-surface-container-high)',
  color: 'var(--mat-sys-on-surface)',
  outline: 'none',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
};
const btnStyle: React.CSSProperties = {
  background: 'none', border: 'none',
  cursor: 'pointer', padding: 8,
  borderRadius: '50%',
};
