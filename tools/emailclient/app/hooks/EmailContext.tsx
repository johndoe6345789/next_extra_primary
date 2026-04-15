'use client'

/**
 * Context to share email state across
 * layout and page components.
 */

import {
  createContext, useContext,
} from 'react'
import { useEmailClient } from './useEmailClient'

type EmailCtx = ReturnType<
  typeof useEmailClient
>

const EmailContext =
  createContext<EmailCtx | null>(null)

/** Access shared email state. */
export function useEmailCtx() {
  const ctx = useContext(EmailContext)
  if (!ctx) {
    throw new Error(
      'useEmailCtx must be used inside ' +
      'EmailProvider',
    )
  }
  return ctx
}

/** Provider wrapping the mail layout. */
export function EmailProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const value = useEmailClient()
  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  )
}
