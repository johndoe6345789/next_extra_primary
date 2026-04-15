import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import './globals.scss'

/**
 * Root layout for the streams operator tool.
 * Mirrors the other T3 tools so the shared M3
 * typography token fonts resolve the same way.
 */
export const metadata: Metadata = {
  title: 'Streams — Nextra',
  description:
    'Live streaming control plane operator tool',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          href={
            'https://fonts.googleapis.com/' +
            'css2?family=Material+Symbols+' +
            'Outlined:opsz,wght,FILL,GRAD' +
            '@20..48,100..700,0..1,-50..200' +
            '&display=swap'
          }
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
