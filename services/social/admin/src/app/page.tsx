'use client'

/**
 * Social admin landing page.
 * Renders tab controls for each of the six social
 * sub-systems in the Phase 7 roadmap.
 */

import { useState } from 'react'
import {
  Typography, Button, Box,
} from '@shared/m3'
import { FollowsTab } from './FollowsTab'
import { DmTab } from './DmTab'
import { GroupsTab } from './GroupsTab'
import { ReactionsTab } from './ReactionsTab'
import { PresenceTab } from './PresenceTab'

type Tab =
  | 'follows' | 'dm' | 'groups'
  | 'reactions' | 'presence'

const TABS: { id: Tab; label: string }[] = [
  { id: 'follows',   label: 'Follows' },
  { id: 'dm',        label: 'Direct messages' },
  { id: 'groups',    label: 'Groups' },
  { id: 'reactions', label: 'Reactions' },
  { id: 'presence',  label: 'Presence' },
]

export default function SocialAdminPage() {
  const [tab, setTab] = useState<Tab>('follows')
  return (
    <Box className="social-shell">
      <Typography variant="h4">
        Social admin
      </Typography>
      <Box className="social-tabs">
        {TABS.map(t => (
          <Button
            key={t.id}
            size="small"
            variant={
              tab === t.id
                ? 'contained' : 'outlined'
            }
            onClick={() => setTab(t.id)}
            data-testid={`social-tab-${t.id}`}
          >
            {t.label}
          </Button>
        ))}
      </Box>
      {tab === 'follows' && <FollowsTab />}
      {tab === 'dm' && <DmTab />}
      {tab === 'groups' && <GroupsTab />}
      {tab === 'reactions' && <ReactionsTab />}
      {tab === 'presence' && <PresenceTab />}
    </Box>
  )
}
