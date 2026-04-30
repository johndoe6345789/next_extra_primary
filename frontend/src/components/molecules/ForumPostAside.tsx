'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography, Avatar } from '@shared/m3';
import { IconButton } from '@shared/m3/inputs/IconButton';
import { Menu, MenuItem } from '@shared/m3/navigation/Menu';
import MoreVertIcon from '@shared/icons/MoreVert';
import { Link } from '@/i18n/navigation';
import { getRank, initials } from './forumPostUtils';
import s from './ForumPost.module.scss';

/** Props for ForumPostAside. */
export interface ForumPostAsideProps {
  /** Author UUID (for profile link). */
  authorId?: string;
  /** Author display name. */
  authorName: string;
  /** Total posts by this author. */
  postCount: number;
  /** Whether the current user can ban this author. */
  canBan: boolean;
  /** Whether the current user IS this author. */
  isSelf: boolean;
  onBan?: () => void;
}

/**
 * Left sidebar column of a forum post: avatar,
 * author name (linked to profile), mafia rank,
 * post count, and (for mods) a ⋮ actions menu.
 */
export function ForumPostAside({
  authorId, authorName, postCount, canBan,
  isSelf, onBan,
}: ForumPostAsideProps): React.ReactElement {
  const t = useTranslations('forum');
  const rank = getRank(postCount);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const showMenu = canBan && !isSelf;

  return (
    <Box className={s.aside}>
      <Link
        href={`/u/${authorId ?? ''}`}
        aria-label={t('viewProfile',
          { name: authorName })}
      >
        <Avatar
          aria-label={authorName}
          className={s.avatar}
        >
          {initials(authorName)}
        </Avatar>
      </Link>
      <Typography component="span"
        className={s.authorName}>
        {authorName}
      </Typography>
      <Typography
        component="span"
        className={s.rank}
        title={`${postCount} posts`}
      >
        <span aria-hidden="true">{rank.emoji}</span>
        {' '}{rank.label}
      </Typography>
      <Typography component="span"
        className={s.postCount}>
        {t('postCount', { n: postCount })}
      </Typography>
      {showMenu && (
        <>
          <IconButton
            ref={btnRef}
            aria-label={t('postActions')}
            className={s.actionsBtn}
            onClick={() => setOpen(true)}
            data-testid="post-actions-btn"
          >
            <MoreVertIcon size={18} />
          </IconButton>
          <Menu
            open={open}
            anchorEl={btnRef.current}
            onClose={() => setOpen(false)}
            anchorRight
            testId="post-actions-menu"
          >
            <MenuItem
              onClick={() => {
                setOpen(false);
                onBan?.();
              }}
              data-testid="post-action-ban"
            >
              {t('banUser', { name: authorName })}
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}

export default ForumPostAside;
