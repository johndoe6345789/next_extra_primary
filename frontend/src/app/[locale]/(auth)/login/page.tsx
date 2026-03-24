import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LoginForm } from '@/components/organisms/LoginForm';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the login page. */
interface LoginPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Login page with a centred card layout.
 *
 * Renders the `LoginForm` organism inside a
 * centred card for authentication.
 *
 * @param props - Page props with locale params.
 * @returns Login page UI.
 */
export default async function LoginPage({
  params,
}: LoginPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      component="main"
      role="main"
      aria-label="Login"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }} elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
          >
            Sign In
          </Typography>
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  );
}
