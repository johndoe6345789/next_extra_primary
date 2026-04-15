'use client'

/**
 * Notification router operator root page.
 * Exposes three tabs — delivery queue,
 * template library, and user preferences —
 * each in its own component to keep this
 * file under the 100-LOC cap.
 */

import { useState } from 'react'
import { Tabs, Tab, Typography } from '@shared/m3'
import { QueueTab } from './QueueTab'
import { TemplatesTab } from './TemplatesTab'
import { PrefsTab } from './PrefsTab'

type TabKey = 'queue' | 'templates' | 'prefs'

export default function NotificationsPage() {
  const [tab, setTab] = useState<TabKey>('queue')

  return (
    <main
      className="notif-shell"
      data-testid="notifications-shell"
      aria-label="Notification router"
    >
      <Typography variant="h4">
        Notification router
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v as TabKey)}
        aria-label="Notification views"
      >
        <Tab
          value="queue"
          label="Delivery queue"
          data-testid="tab-queue"
        />
        <Tab
          value="templates"
          label="Templates"
          data-testid="tab-templates"
        />
        <Tab
          value="prefs"
          label="User prefs"
          data-testid="tab-prefs"
        />
      </Tabs>

      {tab === 'queue' && <QueueTab />}
      {tab === 'templates' && <TemplatesTab />}
      {tab === 'prefs' && <PrefsTab />}
    </main>
  )
}
