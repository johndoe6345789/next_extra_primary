'use client'

/**
 * PageTree — renders the nested wiki tree.
 * Each node is a clickable button that selects
 * the page for the editor pane.
 */

import type { WikiNode } from '@/hooks/useWikiTree'

interface Props {
  nodes: WikiNode[]
  activeId: number | null
  onSelect: (id: number) => void
}

function TreeNode({
  node, activeId, onSelect,
}: {
  node: WikiNode
  activeId: number | null
  onSelect: (id: number) => void
}) {
  return (
    <li>
      <button
        type="button"
        data-active={
          node.id === activeId ? 'true' : 'false'}
        aria-label={`Open ${node.title}`}
        data-testid={`wiki-node-${node.id}`}
        onClick={() => onSelect(node.id)}
      >
        {node.title || node.slug}
      </button>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function PageTree({
  nodes, activeId, onSelect,
}: Props) {
  return (
    <nav
      className="wiki-tree"
      aria-label="Wiki page tree"
      data-testid="wiki-tree"
    >
      <ul>
        {nodes.map((n) => (
          <TreeNode
            key={n.id}
            node={n}
            activeId={activeId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </nav>
  )
}
