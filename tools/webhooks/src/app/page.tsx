'use client'

/**
 * Webhooks operator root page — tabbed
 * dashboard over registered endpoints
 * and the delivery queue.  Each tab is
 * its own component so this render
 * stays under the 100-LOC file cap.
 */

import { useState } from 'react'
import { Button } from
  '@shared/components/m3'
import { useEndpoints } from
  '@/hooks/useEndpoints'
import { useWebhookActions } from
  '@/hooks/useWebhookActions'
import { EndpointsTab } from
  './EndpointsTab'
import { DeliveriesTab } from
  './DeliveriesTab'
import { EndpointEditor } from
  './EndpointEditor'

type Tab = 'endpoints' | 'deliveries'

export default function WebhooksPage() {
  const [tab, setTab] =
    useState<Tab>('endpoints')
  const [editing, setEditing] =
    useState(false)
  const { items, events, refresh } =
    useEndpoints()
  const a = useWebhookActions(refresh)

  return (
    <main
      className="webhooks-shell"
      data-testid="webhooks-shell"
    >
      <h1>Webhook Dispatcher</h1>
      <div
        className="webhooks-tabs"
        role="tablist"
        aria-label="Webhook views"
      >
        <Button
          aria-selected={
            tab === 'endpoints'
          }
          data-testid="tab-endpoints"
          onClick={() =>
            setTab('endpoints')
          }
        >
          Endpoints ({items.length})
        </Button>
        <Button
          aria-selected={
            tab === 'deliveries'
          }
          data-testid="tab-deliveries"
          onClick={() =>
            setTab('deliveries')
          }
        >
          Deliveries
        </Button>
      </div>

      {editing && (
        <EndpointEditor
          events={events}
          onSave={async (i) => {
            const ok = await a.create(i)
            if (ok) setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      )}
      {tab === 'endpoints' && (
        <EndpointsTab
          items={items}
          onNew={() => setEditing(true)}
          onDelete={a.remove}
        />
      )}
      {tab === 'deliveries' && (
        <DeliveriesTab
          onReplay={a.replay}
        />
      )}
    </main>
  )
}
