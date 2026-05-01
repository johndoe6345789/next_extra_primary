import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box } from '@shared/m3';
import { ChatPanel } from
  '@/components/organisms/ChatPanel';
import { PolishPanel } from
  '@/components/molecules/PolishPanel';
import { EditorialHeader } from
  '@/components/molecules/EditorialHeader';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the AI chat page. */
interface ChatPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * AI tutoring chat page — chat panel inside the
 * standard polished surface.
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
      sx={{ width: '100%', maxWidth: '960px',
        marginLeft: 'auto', marginRight: 'auto',
        display: 'flex', flexDirection: 'column',
        flex: 1, minHeight: 0 }}
    >
      <PolishPanel size="comfy">
        <EditorialHeader
          eyebrow="AI Tutor"
          title="Ask anything"
        />
        <ChatPanel />
      </PolishPanel>
    </Box>
  );
}
