'use client'

/**
 * Mutation helpers for email actions —
 * mark read, toggle star, send message.
 * Each returns the parsed JSON or throws.
 */

const HEADERS_JSON = {
  'Content-Type': 'application/json',
  'X-Tenant-Id': 'default',
}

/** Payload for sending a new email. */
export interface SendPayload {
  accountId: number
  to: string
  subject: string
  body: string
}

/** PUT /api/messages/:id/read */
export async function apiMarkRead(
  id: number,
  isRead: boolean,
): Promise<void> {
  const res = await fetch(
    `/emailclient/api/messages/${id}/read`,
    {
      method: 'PUT',
      headers: HEADERS_JSON,
      body: JSON.stringify({ isRead }),
    },
  )
  if (!res.ok) {
    throw new Error(
      `markRead failed: ${res.status}`,
    )
  }
}

/** PUT /api/messages/:id/star */
export async function apiToggleStar(
  id: number,
  isStarred: boolean,
): Promise<void> {
  const res = await fetch(
    `/emailclient/api/messages/${id}/star`,
    {
      method: 'PUT',
      headers: HEADERS_JSON,
      body: JSON.stringify({ isStarred }),
    },
  )
  if (!res.ok) {
    throw new Error(
      `toggleStar failed: ${res.status}`,
    )
  }
}

/** POST /api/compose */
export async function apiSendEmail(
  payload: SendPayload,
): Promise<void> {
  const res = await fetch(
    '/emailclient/api/compose/',
    {
      method: 'POST',
      headers: HEADERS_JSON,
      body: JSON.stringify(payload),
    },
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `send failed: ${res.status} ${text}`,
    )
  }
}
