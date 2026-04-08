'use client';

import Link from 'next/link';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import { Icon } from '@shared/m3/data-display/Icon';
import {
  avatarStyle, nameLink, delBtn,
} from './commentRowStyles';

/** Props for a single comment row. */
export interface CommentRowProps {
  /** Comment ID. */
  id: string;
  /** Comment body text. */
  content: string;
  /** Author username (for link). */
  username: string;
  /** Author display name. */
  displayName: string;
  /** ISO timestamp. */
  createdAt: string;
  /** Whether the current user owns this. */
  mine: boolean;
  /** Delete handler. */
  onDelete: () => void;
}

/** Renders one comment with avatar and link. */
export default function CommentRow({
  content, username, displayName,
  createdAt, mine, onDelete,
}: CommentRowProps) {
  const initial = (displayName || username)?.[0]
    ?.toUpperCase() ?? '?';

  return (
    <Box sx={{
        mt: 2, pt: 2, display: 'flex', gap: 1.5,
        borderTop: '1px solid',
        borderColor:
          'var(--mat-sys-outline-variant)',
      }}
      data-testid="comment-row"
    >
      <Link href={`/profile/${username}`}
        style={avatarStyle}
        aria-label={displayName}
      >
        {initial}
      </Link>
      <div style={{ flex: 1 }}>
        <Typography variant="subtitle2">
          <Link href={`/profile/${username}`}
            style={nameLink}
          >
            {displayName}
          </Link>
          <Typography component="span"
            variant="caption" color="textSecondary"
            style={{ marginLeft: 8 }}
          >
            {new Date(createdAt).toLocaleString()}
          </Typography>
          {mine && (
            <button style={delBtn}
              onClick={onDelete}
              aria-label="Delete comment"
            >
              <Icon size="xs">close</Icon>
            </button>
          )}
        </Typography>
        <Typography variant="body2">
          {content}
        </Typography>
      </div>
    </Box>
  );
}
