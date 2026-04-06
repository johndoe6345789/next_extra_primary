'use client';

import Link from 'next/link';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import { Icon } from '@shared/m3/data-display/Icon';

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
  content, username, displayName, createdAt,
  mine, onDelete,
}: CommentRowProps) {
  const initial = (displayName || username)?.[0]
    ?.toUpperCase() ?? '?';

  return (
    <Box sx={{
        mt: 2, pt: 2, display: 'flex', gap: 1.5,
        borderTop: '1px solid',
        borderColor: 'var(--mat-sys-outline-variant)',
      }}
      data-testid="comment-row"
    >
      <Link href={`/profile/${username}`}
        style={avatarStyle} aria-label={displayName}
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

const avatarStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: '50%',
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary, #fff)',
  display: 'flex', alignItems: 'center',
  justifyContent: 'center', flexShrink: 0,
  fontSize: 14, fontWeight: 700,
  textDecoration: 'none', marginTop: 2,
};
const nameLink: React.CSSProperties = {
  color: 'var(--mat-sys-primary)',
  textDecoration: 'none', cursor: 'pointer',
  fontWeight: 600,
};
const delBtn: React.CSSProperties = {
  background: 'none', border: 'none',
  cursor: 'pointer', marginLeft: 4,
  verticalAlign: 'middle', padding: 0,
};
