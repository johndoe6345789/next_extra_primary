'use client'

/**
 * Shared mail layout — wraps MailLayout in EmailProvider.
 * @module layout
 */

import React from 'react'
import { EmailProvider } from './hooks/EmailContext'
import { MailLayout } from './MailLayout'

/**
 * Next.js route group layout for the mail section.
 * @param children - Nested page content.
 */
export default function MailGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EmailProvider>
      <MailLayout>{children}</MailLayout>
    </EmailProvider>
  )
}
