'use client';
/**
 * Shared context for Accordion compound components.
 */

import React, { createContext, useContext } from 'react'

/** Accordion state shared via context */
export interface AccordionContextValue {
  expanded: boolean
  disabled: boolean
  toggle: (event?: React.SyntheticEvent) => void
}

export const AccordionContext =
  createContext<AccordionContextValue | null>(null)

/**
 * Hook to access the nearest Accordion context.
 * Throws if used outside an Accordion.
 */
export const useAccordionContext =
  (): AccordionContextValue => {
    const ctx = useContext(AccordionContext)
    if (!ctx) {
      throw new Error(
        'Accordion compound components must be '
        + 'used within an Accordion',
      )
    }
    return ctx
  }
