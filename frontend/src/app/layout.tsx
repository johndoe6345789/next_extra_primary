import type { Metadata } from 'next';
import type { ReactNode, ReactElement } from 'react';
import { Inter } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/** Disable static prerender (Redux provider tree). */
export const dynamic = 'force-dynamic';

/** Global metadata for the application. */
export const metadata: Metadata = {
  title: {
    default: 'ExtraPrimary',
    template: '%s | ExtraPrimary',
  },
  description:
    'Gamified learning platform with AI tutoring,' +
    ' badges, streaks, and leaderboards.',
};

/** Props for the root layout. */
interface RootLayoutProps {
  /** Page content rendered inside layout. */
  readonly children: ReactNode;
}

/**
 * Root layout for the entire application.
 *
 * Sets the HTML language attribute, loads the
 * Inter font, and wraps all content in the Redux
 * store and MUI theme providers.
 *
 * @param props - Layout props.
 * @returns Root HTML document shell.
 */
export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
