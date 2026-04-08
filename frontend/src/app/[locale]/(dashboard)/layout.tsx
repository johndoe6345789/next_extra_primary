import { ReactNode, type ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box } from '@shared/m3';
import { DashboardShortcuts } from '@/components/organisms/DashboardShortcuts';

/** Props for the dashboard layout. */
interface DashboardLayoutProps {
  /** Page content rendered inside layout. */
  readonly children: ReactNode;
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Dashboard layout with top navigation bar.
 *
 * Provides a persistent `Navbar` at the top and
 * renders page content in a flex-grow main area.
 * All dashboard routes share this chrome.
 *
 * @param props - Layout props with locale params.
 * @returns Dashboard shell with navigation.
 */
export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <DashboardShortcuts />
      <Box
        component="main"
        role="main"
        aria-label="Dashboard content"
        sx={{
          flex: 1, p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
