import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatPanel } from '@/components/organisms/ChatPanel';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the AI chat page. */
interface ChatPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * AI tutoring chat page.
 *
 * Renders the `ChatPanel` organism in a full-height
 * container for real-time AI conversation.
 *
 * @param props - Page props with locale params.
 * @returns Chat page UI.
 */
export default async function ChatPage({
  params,
}: ChatPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      aria-label="AI Chat"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 128px)',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        AI Tutor
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ChatPanel />
      </Box>
    </Box>
  );
}
