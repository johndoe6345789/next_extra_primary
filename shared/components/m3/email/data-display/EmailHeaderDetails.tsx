import React from 'react'
import { Typography } from '../..'

/** Props for EmailHeaderDetails. */
export interface EmailHeaderDetailsProps {
  from: string
  to: string[]
  cc?: string[]
  receivedAt: number
}

/** From, To, Cc, and date details. */
export const EmailHeaderDetails = ({
  from, to, cc, receivedAt,
}: EmailHeaderDetailsProps) => {
  const iso =
    new Date(receivedAt).toISOString()
  const display =
    new Date(receivedAt).toLocaleString()
  return (
    <div className="header-details">
      <Typography variant="body2"
        className="from"
        data-testid="email-from">
        From: <strong>{from}</strong>
      </Typography>
      <Typography variant="body2"
        className="to"
        data-testid="email-to">
        To: <strong>{to.join(', ')}</strong>
      </Typography>
      {cc && cc.length > 0 && (
        <Typography variant="body2"
          className="cc"
          data-testid="email-cc">
          Cc: <strong>{cc.join(', ')}</strong>
        </Typography>
      )}
      <Typography variant="caption"
        className="date"
        data-testid="email-date">
        <time dateTime={iso}>{display}</time>
      </Typography>
    </div>
  )
}
