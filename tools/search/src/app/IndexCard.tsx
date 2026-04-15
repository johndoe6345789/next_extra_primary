'use client'

/**
 * One registered ES index rendered as an M3
 * card-style Panel with last-reindex, doc
 * count, and a ReindexButton.
 */

import { Panel, Text, Heading } from '@shared/m3'

import type { IndexRow } from
  '@/hooks/useSearchIndexes'
import { ReindexButton } from './ReindexButton'

interface Props {
  row: IndexRow
  busy: string | null
  onReindex: (name: string) => void
}

export function IndexCard({
  row, busy, onReindex,
}: Props) {
  const isBusy = busy === row.name
  return (
    <Panel
      data-testid={`index-${row.name}`}
      aria-label={`Index ${row.name}`}
      className="search-index-card"
    >
      <Heading level={3}>{row.name}</Heading>
      <Text variant="body-small">
        ES index:{' '}
        <code>{row.es_index}</code>
      </Text>
      <Text variant="body-small">
        Source table:{' '}
        <code>{row.target_table}</code>
      </Text>
      <Text variant="body-small">
        Docs: {row.doc_count.toLocaleString()}
      </Text>
      <Text variant="body-small">
        Last reindex:{' '}
        {row.last_reindex_at || '—'}
      </Text>
      <Text
        variant="label-medium"
        data-status={row.status}
      >
        Status: {row.status}
      </Text>
      <ReindexButton
        name={row.name}
        busy={isBusy}
        onClick={onReindex}
      />
    </Panel>
  )
}
