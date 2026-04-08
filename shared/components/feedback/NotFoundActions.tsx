/**
 * NotFoundActions - Action links for 404 page
 */

import React from 'react';
import Link from 'next/link';
import { Box, Button } from '../m3';
import styles from '../../scss/components/feedback/not-found.module.scss';

interface NotFoundActionsProps {
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

/**
 * Primary and secondary action links for
 * the not-found page.
 */
export const NotFoundActions: React.FC<
  NotFoundActionsProps
> = ({
  primaryText, primaryHref,
  secondaryText, secondaryHref,
}) => (
  <Box className={styles.actions}
    data-testid="error-actions">
    {primaryHref && primaryText && (
      <Link href={primaryHref as string}>
        <Button variant="contained"
          data-testid="primary-action">
          {primaryText}
        </Button>
      </Link>
    )}
    {secondaryHref && secondaryText && (
      <Link href={secondaryHref as string}>
        <Button variant="outlined"
          data-testid="secondary-action">
          {secondaryText}
        </Button>
      </Link>
    )}
  </Box>
);
