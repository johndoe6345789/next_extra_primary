'use client';
/**
 * AccordionActions - action buttons at the
 * bottom of an accordion panel.
 */

import React, { forwardRef } from 'react'
import styles
  from '../../../scss/atoms/accordion.module.scss'
import { useAccordionContext }
  from './AccordionContext'
import type { AccordionActionsProps }
  from './AccordionTypes'

/** Action buttons at accordion bottom. */
export const AccordionActions = forwardRef<
  HTMLDivElement, AccordionActionsProps
>(({ children, className = '',
  ...props }, ref) => {
  const { expanded } = useAccordionContext()
  return (
    <div className={styles.accordionCollapse}
      aria-hidden={!expanded}>
      <div className={
        styles.accordionCollapseInner}>
        <div ref={ref} className={[
          styles.accordionActions, className,
        ].filter(Boolean).join(' ')}
          {...props}>{children}</div>
      </div>
    </div>
  )
})
AccordionActions.displayName =
  'AccordionActions'

export default AccordionActions
