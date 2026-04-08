'use client';
/**
 * AccordionSummary - clickable header that
 * toggles the accordion.
 */

import React, {
  forwardRef, useCallback,
} from 'react'
import styles
  from '../../../scss/atoms/accordion.module.scss'
import { useAccordionContext }
  from './AccordionContext'
import type { AccordionSummaryProps }
  from './AccordionTypes'

/** Clickable header that toggles accordion. */
export const AccordionSummary = forwardRef<
  HTMLButtonElement, AccordionSummaryProps
>(({
  children, expandIcon, leadingIcon,
  iconClassName = '', className = '',
  onClick, ...props
}, ref) => {
  const { expanded, disabled, toggle } =
    useAccordionContext()
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      { toggle(e); onClick?.(e) },
    [toggle, onClick])
  return (
    <button ref={ref} type="button"
      className={[
        styles.accordionHeader, className,
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={expanded}
      aria-disabled={disabled}
      {...props}>
      {leadingIcon && (
        <span className={
          styles.accordionLeading
        }>{leadingIcon}</span>
      )}
      <span className={
        styles.accordionTitle
      }>{children}</span>
      {expandIcon && (
        <span className={[
          styles.accordionIcon,
          iconClassName,
        ].filter(Boolean).join(' ')}>
          {expandIcon}
        </span>
      )}
    </button>
  )
})
AccordionSummary.displayName =
  'AccordionSummary'
