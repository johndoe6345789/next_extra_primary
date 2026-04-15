import type { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Admin — Nextra',
  description:
    'Ecommerce products and orders operator',
}

/**
 * Root layout for the shop-admin tool.
 * Sets the Material Symbols font link and the
 * dark data-theme attribute like the other tools.
 */
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
