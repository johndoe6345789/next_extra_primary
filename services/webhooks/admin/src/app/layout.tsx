import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Webhooks — Nextra',
  description:
    'Outbound webhook operator tool',
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
