/**
 * Sidebar listing M3 components grouped by
 * category with click-to-select behavior.
 * @module components/ComponentSidebar
 */
'use client';

import {
  List, ListSubheader, ListItem,
  ListItemButton, ListItemText, Typography,
  AppHeaderActions,
} from '@shared/m3';
import type {
  ComponentDef, Category,
} from '../types';
import type { GroupedDefs } from
  '../hooks/useComponentDefs';

/** Props for ComponentSidebar. */
interface ComponentSidebarProps {
  /** Grouped definitions by category. */
  readonly grouped: GroupedDefs;
  /** Currently selected component name. */
  readonly selectedName: string | null;
  /** Called when a component is clicked. */
  readonly onSelect: (def: ComponentDef) => void;
}

const CATEGORIES: readonly Category[] = [
  'Inputs', 'Surfaces', 'Layout',
  'Data Display', 'Feedback', 'Navigation',
];

/**
 * @brief Renders the grouped component list.
 * @param props - Sidebar configuration.
 * @returns Sidebar JSX element.
 */
export default function ComponentSidebar({
  grouped,
  selectedName,
  onSelect,
}: ComponentSidebarProps) {
  return (
    <nav
      aria-label="Component list"
      data-testid="component-sidebar"
      style={{ width: 240, overflowY: 'auto' }}
    >
      <div style={{
        padding: 16, display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Typography variant="h6">
          M3 Components
        </Typography>
        <AppHeaderActions activePath="/components" />
      </div>
      {CATEGORIES.map((cat) => {
        const defs = grouped.get(cat);
        if (!defs?.length) return null;
        return (
          <List key={cat} dense>
            <ListSubheader>{cat}</ListSubheader>
            {defs.map((d) => (
              <ListItem key={d.name} disablePadding>
                <ListItemButton
                  selected={d.name === selectedName}
                  onClick={() => onSelect(d)}
                  aria-label={`Select ${d.name}`}
                >
                  <ListItemText primary={d.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        );
      })}
    </nav>
  );
}
