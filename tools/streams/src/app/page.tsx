'use client'

/**
 * Streams operator root page — live list
 * of every known stream plus an ingest
 * instructions panel that teaches an
 * operator how to push RTSP with ffmpeg.
 */

import { useStreams } from '@/hooks/useStreams'
import {
  useStreamActions,
} from '@/hooks/useStreamActions'
import { LiveList } from './LiveList'
import {
  IngestInstructions,
} from './IngestInstructions'

export default function StreamsPage() {
  const { items, refresh } = useStreams()
  const { block, kick, remove } =
    useStreamActions(refresh)

  return (
    <main className="streams-shell">
      <h1>Live Streaming</h1>
      <IngestInstructions />
      <LiveList
        rows={items}
        onBlock={block}
        onKick={kick}
        onRemove={remove}
      />
    </main>
  )
}
