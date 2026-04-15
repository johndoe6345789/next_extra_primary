'use client'

/**
 * Image processor operator root page. Exposes
 * three tabs — job queue, variant preview, and
 * default spec editor — each in its own
 * component so this file stays under 100 LOC.
 */

import { useState } from 'react'
import { Tabs, Tab, Typography } from '@shared/m3'
import { JobsTab } from './JobsTab'
import { VariantsTab } from './VariantsTab'
import { SpecsTab } from './SpecsTab'

type TabKey = 'jobs' | 'variants' | 'specs'

export default function ImageProcessorPage() {
  const [tab, setTab] = useState<TabKey>('jobs')
  const [sel, setSel] = useState<number | null>(
    null,
  )

  return (
    <main
      className="img-shell"
      data-testid="image-shell"
      aria-label="Image processor"
    >
      <Typography variant="h4">
        Image processor
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v as TabKey)}
        aria-label="Image views"
      >
        <Tab
          value="jobs"
          label="Jobs"
          data-testid="tab-jobs"
        />
        <Tab
          value="variants"
          label="Variants"
          data-testid="tab-variants"
        />
        <Tab
          value="specs"
          label="Specs"
          data-testid="tab-specs"
        />
      </Tabs>

      {tab === 'jobs' && (
        <JobsTab
          selectedId={sel}
          onSelect={setSel}
        />
      )}
      {tab === 'variants' && (
        <VariantsTab jobId={sel} />
      )}
      {tab === 'specs' && <SpecsTab />}
    </main>
  )
}
