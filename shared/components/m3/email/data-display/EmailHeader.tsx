import React from 'react'
import { Box, BoxProps, Typography }
  from '../..'
import { useAccessible }
  from '../../../../hooks/useAccessible'
import { StarButton } from '../atoms'
import { EmailHeaderDetails }
  from './EmailHeaderDetails'

/** Props for EmailHeader component. */
export interface EmailHeaderProps
  extends BoxProps {
  from: string
  to: string[]
  cc?: string[]
  subject: string
  receivedAt: number
  isStarred?: boolean
  onToggleStar?: (
    starred: boolean
  ) => void
  testId?: string
}

/** Email detail header with subject/star. */
export const EmailHeader = ({
  from, to, cc, subject,
  receivedAt, isStarred = false,
  onToggleStar,
  testId: customTestId,
  ...props
}: EmailHeaderProps) => {
  const accessible = useAccessible({
    feature: 'email',
    component: 'email-header',
    identifier: customTestId || subject,
  })
  return (
    <Box role="banner"
      aria-label="Email details"
      className="email-header"
      {...accessible} {...props}>
      <div className="header-top">
        <Typography variant="h5"
          id="email-subject"
          className="subject">
          {subject}
        </Typography>
        <StarButton isStarred={isStarred}
          onToggleStar={onToggleStar} />
      </div>
      <EmailHeaderDetails
        from={from} to={to}
        cc={cc} receivedAt={receivedAt} />
    </Box>
  )
}
