/**
 * Declarative page-config tree for the email_client package.
 * Imported by the GET route handler.
 * @module pageConfigData
 */

import { PHASES, phaseCard } from './phaseCards';

/** Full declarative page configuration object. */
export const EMAIL_PAGE_CONFIG = {
  type: 'Box',
  props: {
    sx: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      gap: 2,
      padding: 2,
    },
  },
  children: [
    {
      type: 'Box',
      props: {
        sx: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 2,
          borderBottom: '1px solid #e0e0e0',
        },
      },
      children: [
        {
          type: 'Typography',
          props: { variant: 'h4' },
          children: ['Email Client'],
        },
        {
          type: 'Typography',
          props: {
            variant: 'caption',
            color: 'textSecondary',
          },
          children: ['v1.0.0 - Production Ready'],
        },
      ],
    },
    {
      type: 'Alert',
      props: { severity: 'info' },
      children: [
        'Email client phases 1-5 complete. '
        + 'Production build ready. API endpoints live.',
      ],
    },
    {
      type: 'Box',
      props: {
        sx: {
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 2,
          marginTop: 2,
        },
      },
      children: PHASES.map(phaseCard),
    },
  ],
};
