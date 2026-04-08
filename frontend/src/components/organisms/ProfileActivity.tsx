'use client';

import { useState } from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import { useAuth } from '@/hooks';
import {
  useListCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from '@/store/api';
import CommentRow from '../molecules/CommentRow';
import CommentInput from
  '../molecules/CommentInput';

/**
 * Activity feed backed by the comments API.
 * Authenticated users can post and delete their
 * own comments.
 */
export default function ProfileActivity() {
  const { user } = useAuth();
  const { data: comments = [] } =
    useListCommentsQuery(
      { limit: 50, offset: 0 },
    );
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
        <CommentInput
          draft={draft}
          setDraft={setDraft}
          onPost={post}
        />
        {comments.length === 0 ? (
          <Typography variant="body2"
            color="textSecondary"
            style={{ marginTop: 12 }}
          >
            No activity yet.
          </Typography>
        ) : (
          comments.map((c) => (
            <CommentRow key={c.id}
              id={c.id}
              content={c.content}
              username={c.username}
              displayName={c.displayName}
              createdAt={c.createdAt}
              mine={
                c.username === user?.username
              }
              onDelete={() => remove(c.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
