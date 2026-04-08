import React from 'react';
import { classNames } from '../utils/classNames';

export interface TimelineItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  position?: 'left' | 'right';
}

/** Single item within a Timeline. */
export function TimelineItem({
  children, position, className, ...props
}: TimelineItemProps) {
  return (
    <li
      className={classNames(
        'm3-timeline-item',
        position && `m3-timeline-item-position-${position}`,
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

export interface TimelineSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Vertical separator between timeline items. */
export function TimelineSeparator({
  children, className, ...props
}: TimelineSeparatorProps) {
  return (
    <div className={classNames('m3-timeline-separator', className)} {...props}>
      {children}
    </div>
  );
}

export interface TimelineConnectorProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

/** Connecting line between timeline dots. */
export function TimelineConnector({
  className, ...props
}: TimelineConnectorProps) {
  return (
    <span className={classNames('m3-timeline-connector', className)} {...props} />
  );
}

export interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Content area of a timeline item. */
export function TimelineContent({
  children, className, ...props
}: TimelineContentProps) {
  return (
    <div className={classNames('m3-timeline-content', className)} {...props}>
      {children}
    </div>
  );
}
