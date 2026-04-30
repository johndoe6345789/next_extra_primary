'use client'

/**
 * Heavy domain components (Monaco editor, Terminal,
 * SQL query UI). Kept out of the main `@shared/m3`
 * barrel because Monaco alone pulls multi-MB chunks
 * that exhaust the Turbopack dev RSC stream timeout.
 *
 * Usage (only on pages that actually need them):
 *   import { MonacoEditor } from '@shared/m3/domain'
 */
export * from './_exports_domain'
