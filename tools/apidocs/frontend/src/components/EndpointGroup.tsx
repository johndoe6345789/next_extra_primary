/**
 * @file EndpointGroup.tsx
 * @brief Accordion of endpoints grouped by tag.
 */

'use client';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
} from '@shared/m3';
import type {
  EndpointGroup as GroupType,
} from '@/hooks/types';
import EndpointCard from './EndpointCard';

/** @brief Props for EndpointGroup. */
interface EndpointGroupProps {
  /** The group with tag and endpoints. */
  group: GroupType;
}

/**
 * @brief Accordion section for a tag group.
 * @param props - Component props.
 * @returns Accordion element with endpoints.
 */
export default function EndpointGroup(
  { group }: EndpointGroupProps,
) {
  const count = group.endpoints.length;

  return (
    <Accordion
      data-testid={`group-${group.tag}`}
      aria-label={`${group.tag} endpoints`}
      defaultExpanded
    >
      <AccordionSummary>
        <Typography variant="h6">
          {group.tag}
        </Typography>
        <Chip
          label={`${count}`}
          style={{
            marginLeft: '12px',
            fontSize: '12px',
          }}
          aria-label={`${count} endpoints`}
          data-testid="group-count"
        />
      </AccordionSummary>
      <AccordionDetails>
        {group.endpoints.map((ep) => (
          <EndpointCard
            key={`${ep.method}-${ep.path}`}
            entry={ep}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
