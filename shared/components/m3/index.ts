'use client'

/**
 * FakeMUI Components - Material Design 3 React Component Library
 *
 * This barrel re-exports all FakeMUI components from category
 * sub-barrels. The actual export lists live in `_exports_*.ts`
 * siblings to keep every file under the 100-LOC project limit.
 *
 * Usage:
 *   import { Button, Card } from '@shared/components/m3'
 */

export * from './_exports_core'
export * from './_exports_display'
export * from './_exports_nav'
export * from './_exports_utils'

// `_exports_domain` (Monaco, Terminal, full DB query UI) is
// NOT re-exported here. It pulls multi-MB chunks (Monaco)
// that explode the Turbopack dev chunk graph and leave RSC
// Suspense boundaries pending forever. Import those via
// `@shared/m3/domain` on the pages that actually use them.
