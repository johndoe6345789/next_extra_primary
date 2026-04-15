'use client'

/**
 * Checkbox fieldset for choosing which
 * event types a webhook endpoint
 * subscribes to.  Split out of
 * EndpointEditor so both files can
 * stay under the 100-LOC cap.
 */

import type {
  EventType,
} from '@/hooks/useEndpoints'

interface Props {
  events: EventType[]
  picked: string[]
  onToggle: (ev: string) => void
}

export function EventsPicker({
  events, picked, onToggle,
}: Props) {
  return (
    <fieldset
      data-testid="events-picker"
      aria-label="Subscribed events"
    >
      <legend>Events</legend>
      {events.map((ev) => (
        <label key={ev.event_type}>
          <input
            type="checkbox"
            checked={picked.includes(
              ev.event_type,
            )}
            onChange={() =>
              onToggle(ev.event_type)
            }
          />
          {ev.event_type}
        </label>
      ))}
    </fieldset>
  )
}
