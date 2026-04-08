/**
 * Not Found State - FakeMUI Component
 * 404 error page with fail whale illustration
 */

import React from 'react';
import { Box, Typography } from '../m3';
import { FailWhale } from './FailWhale';
import { NotFoundActions }
  from './NotFoundActions';
import type { NotFoundStateProps }
  from './notFoundTypes';
import styles from '../../scss/components/feedback/not-found.module.scss';

export type { NotFoundStateProps }
  from './notFoundTypes';

/**
 * NotFoundState - 404 page with fail whale.
 * @param props - Component props.
 */
export const NotFoundState: React.FC<
  NotFoundStateProps
> = ({
  errorCode = '404',
  title = 'Page not found',
  description = "Looks like this page swam away!",
  primaryActionText = 'Go to Dashboard',
  primaryActionHref = '/',
  secondaryActionText = 'View Workflows',
  secondaryActionHref = '/workflows',
  className, ...rest
}) => (
  <Box
    className={
      `${styles.notFoundContainer} ${className || ''}`}
    {...rest} data-testid="not-found-state">
    <Box className={styles.illustration}
      data-testid="fail-whale-illustration">
      <FailWhale />
    </Box>
    <Typography variant="h1"
      className={styles.errorCode}
      data-testid="error-code">
      {errorCode}
    </Typography>
    <Typography variant="h2"
      className={styles.title}
      data-testid="error-title">
      {title}
    </Typography>
    <Typography variant="body1"
      className={styles.description}
      data-testid="error-description">
      {description}
    </Typography>
    <NotFoundActions
      primaryText={primaryActionText}
      primaryHref={primaryActionHref}
      secondaryText={secondaryActionText}
      secondaryHref={secondaryActionHref} />
    <Typography variant="caption"
      className={styles.errorMeta}
      data-testid="error-meta">
      Error code: {errorCode} &bull;
      Page not found
    </Typography>
  </Box>
);
