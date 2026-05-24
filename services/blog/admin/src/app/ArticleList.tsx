'use client'

/**
 * ArticleList — left-hand sidebar rendering
 * every article as a selectable row.  Uses
 * the shared M3 List/Button molecules only;
 * no raw <button> elements.
 */

import {
  Button,
  List,
  ListItem,
} from '@shared/m3'

import type { Article } from '@/hooks/useArticles'

export interface ArticleListProps {
  /** Rows fetched from useArticles. */
  rows: Article[]
  /** Currently-selected article id. */
  activeId: number | null
  /** Called when the user picks a row. */
  onSelect: (id: number) => void
  /** Called when the user hits "New draft". */
  onCreate: () => void
}

export function ArticleList({
  rows,
  activeId,
  onSelect,
  onCreate,
}: ArticleListProps) {
  return (
    <aside
      data-testid="article-list"
      aria-label="Article list"
    >
      <Button
        data-testid="article-new"
        aria-label="Create new draft"
        onClick={onCreate}
      >
        New draft
      </Button>
      <List>
        {rows.map((row) => (
          <ListItem
            key={row.id}
            selected={row.id === activeId}
            onClick={() => onSelect(row.id)}
            data-testid={`article-${row.id}`}
            aria-label={`Open ${row.title}`}
          >
            <strong>{row.title || '(untitled)'}</strong>
            <span>{row.status}</span>
          </ListItem>
        ))}
      </List>
    </aside>
  )
}
