import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

/** Props for the notifications page. */
interface NotificationsPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Notifications page displaying user alerts.
 *
 * Renders a full list of notifications with
 * accessible list semantics and placeholder
 * content until real data is connected.
 *
 * @param props - Page props with locale params.
 * @returns Notifications page UI.
 */
export default async function NotificationsPage({
  params,
}: NotificationsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box aria-label="Notifications">
      <Typography variant="h4" component="h1" gutterBottom>
        Notifications
      </Typography>
      <List aria-label="Notification list">
        <ListItem>
          <ListItemText
            primary="No notifications yet"
            secondary={'Your alerts and updates' + ' will appear here.'}
          />
        </ListItem>
      </List>
    </Box>
  );
}
