/**
 * Phase card data and builder for email_client page-config.
 * @module phaseCards
 */

/** A single phase summary card. */
export interface PhaseCard {
  title: string;
  desc: string;
}

export const PHASES: PhaseCard[] = [
  {
    title: '✅ Phase 1: DBAL Schemas',
    desc: 'EmailClient, EmailFolder, EmailMessage, '
      + 'EmailAttachment',
  },
  {
    title: '✅ Phase 2: M3 Components',
    desc: '22 email components fully implemented '
      + 'and exported',
  },
  {
    title: '✅ Phase 3: Redux Slices',
    desc: 'Email state management complete',
  },
  {
    title: '✅ Phase 4: Custom Hooks',
    desc: '6 hooks for email operations',
  },
  {
    title: '🚀 Phase 5: API Endpoints',
    desc: 'Package loading endpoints live',
  },
  {
    title: '⏳ Phase 6-8: Backend',
    desc: 'Workflow plugins, services, Docker',
  },
];

/** Build a declarative Card node for one phase. */
export function phaseCard(phase: PhaseCard) {
  return {
    type: 'Card',
    props: { sx: { padding: 2 } },
    children: [
      {
        type: 'Typography',
        props: { variant: 'h6' },
        children: [phase.title],
      },
      {
        type: 'Typography',
        props: {
          variant: 'body2',
          color: 'textSecondary',
        },
        children: [phase.desc],
      },
    ],
  };
}
