'use client';
/**
 * Accordion sub-components: Details, Actions,
 * Group, and ExpandMoreIcon.
 */

import React, { forwardRef } from 'react'
import styles
  from '../../../scss/atoms/accordion.module.scss'
import { useAccordionContext }
  from './AccordionContext'
import type {
  AccordionDetailsProps,
  AccordionGroupProps,
  ExpandMoreIconProps,
} from './AccordionTypes'

export { AccordionSummary }
  from './AccordionSummary'
export { AccordionActions }
  from './AccordionActions'

/** Collapsible content area. */
export const AccordionDetails = forwardRef<
  HTMLDivElement, AccordionDetailsProps
>(({ children, padded = false,
  className = '', ...props }, ref) => {
  const { expanded } = useAccordionContext()
  const cls = [
    styles.accordionContent,
    padded ? styles.accordionContentPadded
      : '', className,
  ].filter(Boolean).join(' ')
  return (
    <div className={styles.accordionCollapse}
      aria-hidden={!expanded}>
      <div className={
        styles.accordionCollapseInner}>
        <div ref={ref} className={cls}
          {...props}>{children}</div>
      </div>
    </div>
  )
})
AccordionDetails.displayName =
  'AccordionDetails'

/** Accordion group with optional flush. */
export const AccordionGroup = forwardRef<
  HTMLDivElement, AccordionGroupProps
>(({ children, flush = false,
  className = '', ...props }, ref) => (
  <div ref={ref} className={[
    styles.accordionGroup,
    flush ? styles.accordionGroupFlush : '',
    className,
  ].filter(Boolean).join(' ')}
    {...props}>{children}</div>
))
AccordionGroup.displayName = 'AccordionGroup'

/** Default chevron-down expand icon. */
export const ExpandMoreIcon: React.FC<
  ExpandMoreIconProps
> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="currentColor" {...props}>
    <path d={
      'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
    } />
  </svg>
)
