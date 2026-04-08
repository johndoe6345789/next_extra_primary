'use client';
/** Accordion - expandable panel with compound components. */

import React, { forwardRef, useState, useCallback, useMemo } from 'react'
import styles from '../../../scss/atoms/accordion.module.scss'
import { AccordionContext } from './AccordionContext'
import type {
  AccordionProps,
  AccordionVariant,
} from './AccordionTypes'

export type { AccordionProps, AccordionVariant, AccordionSummaryProps, AccordionDetailsProps, AccordionActionsProps, AccordionGroupProps, ExpandMoreIconProps } from './AccordionTypes'
export { AccordionSummary, AccordionDetails, AccordionActions, AccordionGroup, ExpandMoreIcon } from './AccordionParts'

const variantMap: Record<AccordionVariant, string> = {
  elevated: styles.accordionElevated,
  outlined: styles.accordionOutlined,
  filled: styles.accordionFilled,
}

/** Expandable panel with controlled/uncontrolled state. */
export const Accordion = forwardRef<
  HTMLDivElement, AccordionProps
>(({
  children,
  expanded: controlled,
  defaultExpanded = false,
  onChange,
  disabled = false,
  variant = 'elevated',
  disableGutters = false,
  square = false,
  className = '',
  testId,
  ...props
}, ref) => {
  const isControlled = controlled !== undefined
  const [internal, setInternal] = useState(
    defaultExpanded,
  )
  const expanded = isControlled ? controlled : internal

  const toggle = useCallback(
    (event?: React.SyntheticEvent) => {
      if (disabled) return
      const next = !expanded
      if (!isControlled) setInternal(next)
      if (event) onChange?.(event, next)
    },
    [disabled, expanded, isControlled, onChange],
  )

  const ctx = useMemo(
    () => ({ expanded, disabled, toggle }),
    [expanded, disabled, toggle],
  )

  const cls = [
    styles.accordion,
    expanded ? styles.accordionOpen : '',
    disabled ? styles.accordionDisabled : '',
    variantMap[variant] || '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cls}
        aria-expanded={expanded}
        aria-disabled={disabled}
        data-testid={testId}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
})

Accordion.displayName = 'Accordion'

export default Accordion
