'use client'

/**
 * Wiki tool root page — composes the tree,
 * editor, revision list, and diff viewer.
 */

import { useState } from 'react'
import { useWikiTree } from '@/hooks/useWikiTree'
import { useWikiPage } from '@/hooks/useWikiPage'
import {
  useRevisions,
} from '@/hooks/useRevisions'

import PageTree from './PageTree'
import PageEditor from './PageEditor'
import RevisionList from './RevisionList'
import DiffView from './DiffView'

export default function WikiPage() {
  const [activeId, setActiveId] =
    useState<number | null>(null)

  const { tree, refresh: refreshTree } =
    useWikiTree()
  const { page, save } = useWikiPage(activeId)
  const { revisions, diff, loadDiff } =
    useRevisions(activeId)

  const handleSave = async (
    title: string, body: string,
  ) => {
    await save(title, body)
    await refreshTree()
  }

  return (
    <main
      className="wiki-shell"
      data-testid="wiki-shell"
    >
      <PageTree
        nodes={tree}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <section className="wiki-main">
        <h1>Wiki</h1>
        <PageEditor
          page={page}
          onSave={handleSave}
        />
        <RevisionList
          revisions={revisions}
          onDiff={(f, t) =>
            void loadDiff(f, t)}
        />
        <DiffView diff={diff} />
      </section>
    </main>
  )
}
