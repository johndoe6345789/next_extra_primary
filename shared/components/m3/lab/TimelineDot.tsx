import React from 'react';
import { classNames } from '../utils/classNames';

export interface TimelineDotProps
  extends React.HTMLAttributes<
    HTMLSpanElement
  > {
  children?: React.ReactNode;
  color?:
    | 'grey'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  variant?: 'filled' | 'outlined';
}

/** Circular dot marker on the timeline. */
export function TimelineDot({
  children,
  color = 'grey',
  variant = 'filled',
  className,
  ...props
}: TimelineDotProps) {
  return (
    <span
      className={classNames(
        'm3-timeline-dot',
        `m3-timeline-dot-${variant}`,
        `m3-timeline-dot-${color}`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface TimelineOppositeContentProps
  extends React.HTMLAttributes<
    HTMLDivElement
  > {
  children?: React.ReactNode;
}

/** Opposite-side content for timeline items. */
export function TimelineOppositeContent({
  children,
  className,
  ...props
}: TimelineOppositeContentProps) {
  return (
    <div
      className={classNames(
        'm3-timeline-opposite-content',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
