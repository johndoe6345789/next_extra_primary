'use client'

/**
 * Endpoints tab — table of registered
 * webhook endpoints plus a button that
 * opens the create-endpoint editor.
 * The editor overlay itself is rendered
 * by the parent page so this file can
 * stay under the 100-LOC file cap.
 */

import { Button } from
  '@shared/components/m3'
import type {
  Endpoint,
} from '@/hooks/useEndpoints'

interface Props {
  items: Endpoint[]
  onNew: () => void
  onDelete: (id: number) => void
}

export function EndpointsTab({
  items, onNew, onDelete,
}: Props) {
  return (
    <section
      aria-label="Webhook endpoints"
      data-testid="endpoints-tab"
    >
      <Button
        onClick={onNew}
        data-testid="new-endpoint"
      >
        + New endpoint
      </Button>
      <table
        className="webhooks-table"
        data-testid="endpoints-table"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>Events</th>
            <th>Active</th>
            <th>Fails</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.url}</td>
              <td>{e.events}</td>
              <td>
                {e.active ? 'yes' : 'no'}
              </td>
              <td>{e.failure_streak}</td>
              <td>
                <Button
                  variant="text"
                  aria-label={
                    `Delete ${e.id}`
                  }
                  onClick={() =>
                    onDelete(e.id)
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
