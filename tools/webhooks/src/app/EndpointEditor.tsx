'use client'

/**
 * Inline editor form for creating a
 * new webhook endpoint.  Local state
 * holds the URL, shared secret, and
 * picked event list; on submit the
 * parent onSave callback receives a
 * fully populated EndpointInput.
 */

import { useState } from 'react'
import {
  Button, Input,
} from '@shared/components/m3'
import type {
  EventType,
} from '@/hooks/useEndpoints'
import type {
  EndpointInput,
} from '@/hooks/useWebhookActions'
import { EventsPicker } from
  './EventsPicker'

interface Props {
  events: EventType[]
  onSave: (
    i: EndpointInput,
  ) => Promise<void>
  onCancel: () => void
}

export function EndpointEditor({
  events, onSave, onCancel,
}: Props) {
  const [url, setUrl] = useState('')
  const [secret, setSecret] =
    useState('')
  const [picked, setPicked] =
    useState<string[]>([])

  const toggle = (ev: string) =>
    setPicked((p) =>
      p.includes(ev)
        ? p.filter((x) => x !== ev)
        : [...p, ev],
    )

  return (
    <form
      className="webhook-editor"
      data-testid="endpoint-editor"
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          url,
          secret,
          events: picked,
          active: true,
        })
      }}
    >
      <Input
        value={url}
        placeholder="https://..."
        aria-label="Target URL"
        onChange={(e) =>
          setUrl(e.target.value)
        }
      />
      <Input
        value={secret}
        placeholder="Shared secret"
        aria-label="Shared secret"
        onChange={(e) =>
          setSecret(e.target.value)
        }
      />
      <EventsPicker
        events={events}
        picked={picked}
        onToggle={toggle}
      />
      <Button type="submit">Save</Button>
      <Button
        type="button"
        variant="text"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </form>
  )
}
