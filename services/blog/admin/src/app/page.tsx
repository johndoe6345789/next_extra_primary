'use client'

/**
 * Blog operator root page — shows a list of
 * articles on the left, the active editor on
 * the right, and a schedule dialog launched
 * from the editor toolbar.
 */

import { useState } from 'react'

import { useArticles } from '@/hooks/useArticles'
import {
  useArticleMutations,
} from '@/hooks/useArticleMutations'

import { ArticleList } from './ArticleList'
import { ArticleEditor } from './ArticleEditor'

export default function BlogPage() {
  const { items, refresh } = useArticles()
  const mutations = useArticleMutations(refresh)
  const [activeId, setActiveId] =
    useState<number | null>(null)

  const active = items.find(
    (a) => a.id === activeId,
  ) ?? null

  return (
    <main
      className="blog-shell"
      data-testid="blog-shell"
      aria-label="Blog operator tool"
    >
      <h1>Articles</h1>
      <div className="blog-grid">
        <ArticleList
          rows={items}
          activeId={activeId}
          onSelect={setActiveId}
          onCreate={async () => {
            const id = await mutations.createDraft()
            if (id !== null) setActiveId(id)
          }}
        />
        <ArticleEditor
          article={active}
          onSave={mutations.save}
          onPublish={mutations.publishNow}
          onSchedule={mutations.schedule}
        />
      </div>
    </main>
  )
}
