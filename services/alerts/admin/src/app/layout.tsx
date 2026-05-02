import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'

import { DEFAULT_LOCALE, MESSAGES } from
  '@/i18n/messages'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Alerts — Nextra',
  description:
    'Unified notification centre',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const locale = DEFAULT_LOCALE
  return (
    <html lang={locale} data-theme="dark">
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
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={MESSAGES[locale]}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
