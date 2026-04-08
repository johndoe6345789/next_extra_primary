import React from 'react';
import { classNames } from '../utils/classNames';

export {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
} from './TimelineParts';
export type {
  TimelineItemProps,
  TimelineSeparatorProps,
  TimelineConnectorProps,
  TimelineContentProps,
} from './TimelineParts';
export {
  TimelineDot,
  TimelineOppositeContent,
} from './TimelineDot';
export type {
  TimelineDotProps,
  TimelineOppositeContentProps,
} from './TimelineDot';

export interface TimelineProps
  extends React.HTMLAttributes<
    HTMLUListElement
  > {
  children?: React.ReactNode;
  position?: 'left' | 'right' | 'alternate';
  /** Test ID for automated testing */
  testId?: string;
}

/** Timeline container component. */
export function Timeline({
  children,
  position = 'right',
  className,
  testId,
  ...props
}: TimelineProps) {
  return (
    <ul
      className={classNames(
        'm3-timeline',
        `m3-timeline-position-${position}`,
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </ul>
  );
}

export default Timeline;
