'use client'

/**
 * ArticleEditor — dual-pane markdown editor.
 * Left: M3TextArea input; right: rendered
 * preview.  Toolbar uses only M3 components.
 */

import { useState, useEffect } from 'react'

import {
  M3Button,
  M3TextField,
  M3TextArea,
} from '@shared/m3'

import type { Article } from '@/hooks/useArticles'
import { MarkdownPreview } from './MarkdownPreview'
import { ScheduleDialog } from './ScheduleDialog'

export interface ArticleEditorProps {
  article: Article | null
  onSave: (a: Article) => Promise<void>
  onPublish: (a: Article) => Promise<void>
  onSchedule: (
    a: Article, when: string,
  ) => Promise<void>
}

export function ArticleEditor(
  p: ArticleEditorProps,
) {
  const [draft, setDraft] = useState<Article | null>(
    p.article,
  )
  const [scheduling, setScheduling] = useState(false)

  useEffect(() => setDraft(p.article), [p.article])

  if (!draft) return (
    <section
      data-testid="article-editor-empty"
      aria-label="No article selected"
    ><p>Select or create an article to edit.</p></section>
  )

  return (
    <section
      data-testid="article-editor"
      aria-label="Article editor"
    >
      <M3TextField
        label="Title"
        value={draft.title}
        onChange={(v) =>
          setDraft({ ...draft, title: v })
        }
        data-testid="article-title"
      />
      <M3TextArea
        label="Body (Markdown)"
        value={draft.body_md}
        onChange={(v) =>
          setDraft({ ...draft, body_md: v })
        }
        data-testid="article-body"
        rows={18}
      />
      <MarkdownPreview source={draft.body_md} />
      <M3Button
        data-testid="article-save"
        onClick={() => p.onSave(draft)}
      >
        Save draft
      </M3Button>
      <M3Button
        data-testid="article-publish"
        onClick={() => p.onPublish(draft)}
      >
        Publish now
      </M3Button>
      <M3Button
        data-testid="article-schedule"
        onClick={() => setScheduling(true)}
      >
        Schedule
      </M3Button>
      {scheduling && (
        <ScheduleDialog
          onCancel={() => setScheduling(false)}
          onConfirm={async (when) => {
            await p.onSchedule(draft, when)
            setScheduling(false)
          }}
        />
      )}
    </section>
  )
}
