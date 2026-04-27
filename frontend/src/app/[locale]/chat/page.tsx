import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        AI Tutor
      </Typography>
      <ChatPanel />
    </Box>
  );
}
