'use client'

/**
 * Shared cross-app drawer.
 *
 * Renders a left-anchored M3 Drawer with a
 * fixed list of links to every tool in the
 * portal. Used by every tool's burger menu so
 * the user can jump anywhere with one click.
 *
 * Links are absolute paths through the nginx
 * portal, so they bypass each tool's basePath.
 */

import React from 'react'
import { Drawer } from '../surfaces/Drawer'
import { List } from '../data-display/List'
import {
  ListItemButton,
} from '../data-display/ListItemButton'
import {
  ListItemText,
} from '../data-display/ListItemText'
import {
  APP_LINKS, AppLink,
} from './appDrawerLinks'

/** Props for AppDrawer. */
export interface AppDrawerProps {
  open: boolean
  onClose: () => void
  /** Override the default link list. */
  links?: AppLink[]
  /** Path to mark as the current app. */
  activePath?: string
  testId?: string
}

/** M3 drawer with cross-tool nav links. */
export const AppDrawer: React.FC<
  AppDrawerProps
> = ({
  open, onClose,
  links = APP_LINKS,
  activePath,
  testId = 'app-drawer',
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      variant="temporary"
      testId={testId}
    >
      <List style={{ minWidth: 240 }}>
        {links.map(link => {
          const active =
            !!activePath &&
            activePath.startsWith(link.path)
          return (
            <ListItemButton
              key={link.path}
              selected={active}
              onClick={() => {
                window.location.href = link.path
              }}
              data-testid={
                `${testId}-link-${link.key}`
              }
            >
              <ListItemText
                primary={link.label}
                secondary={link.description}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Drawer>
  )
}

export default AppDrawer
