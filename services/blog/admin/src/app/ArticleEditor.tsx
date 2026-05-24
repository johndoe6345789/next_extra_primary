'use client'

/**
 * ArticleEditor — dual-pane markdown editor.
 * Left: Textarea input; right: rendered
 * preview.  Toolbar uses only M3 components.
 */

import { useState, useEffect } from 'react'

import {
  Button,
  TextField,
  Textarea,
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
      <TextField
        label="Title"
        value={draft.title}
        onChange={(e) =>
          setDraft({ ...draft, title: e.target.value })
        }
        data-testid="article-title"
      />
      <Textarea
        aria-label="Body (Markdown)"
        value={draft.body_md}
        onChange={(e) =>
          setDraft({ ...draft, body_md: e.target.value })
        }
        data-testid="article-body"
        rows={18}
      />
      <MarkdownPreview source={draft.body_md} />
      <Button
        data-testid="article-save"
        onClick={() => p.onSave(draft)}
      >
        Save draft
      </Button>
      <Button
        data-testid="article-publish"
        onClick={() => p.onPublish(draft)}
      >
        Publish now
      </Button>
      <Button
        data-testid="article-schedule"
        onClick={() => setScheduling(true)}
      >
        Schedule
      </Button>
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
