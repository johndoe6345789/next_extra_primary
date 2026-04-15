'use client'

/**
 * PageEditor — inline markdown editor for a
 * single wiki page. Save triggers a PUT and
 * the parent's reload() helpers re-fetch tree
 * and revision history.
 */

import { useEffect, useState } from 'react'
import type { WikiPage } from '@/hooks/useWikiPage'

interface Props {
  page: WikiPage | null
  onSave: (title: string, bodyMd: string)
    => Promise<void>
}

export default function PageEditor({
  page, onSave,
}: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    setTitle(page?.title ?? '')
    setBody(page?.bodyMd ?? '')
  }, [page])

  if (!page) {
    return (
      <section
        className="wiki-editor"
        data-testid="wiki-editor-empty"
        aria-label="No page selected"
      >
        <p>Select a page from the tree.</p>
      </section>
    )
  }

  return (
    <section
      className="wiki-editor"
      data-testid="wiki-editor"
      aria-label={`Editor for ${page.slug}`}
    >
      <input
        type="text"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)}
        aria-label="Page title"
        data-testid="wiki-editor-title"
      />
      <textarea
        value={body}
        onChange={(e) =>
          setBody(e.target.value)}
        aria-label="Page body (markdown)"
        data-testid="wiki-editor-body"
      />
      <button
        type="button"
        onClick={() =>
          void onSave(title, body)}
        aria-label="Save page"
        data-testid="wiki-editor-save"
      >
        Save
      </button>
    </section>
  )
}
