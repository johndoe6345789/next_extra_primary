import { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';
import { Navbar } from '@/components/organisms/Navbar';
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
}: DashboardLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <DashboardShortcuts />
      <Navbar />
      <Box
        component="main"
        role="main"
        aria-label="Dashboard content"
        sx={{ flex: 1, p: 3 }}
      >
        {children}
      </Box>
    </Box>
  );
}
