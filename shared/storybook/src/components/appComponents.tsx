/**
 * App-specific components for JSON registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'
import { Typography } from './typographyComponent'
import { Avatar, Badge } from './displayComponents'

/** Level4 admin header. */
export const Level4Header: React.FC<
  ComponentProps & {
    username?: string; nerdMode?: boolean
  }
> = ({ username = 'User', nerdMode = false }) => (
  <header className="border-b p-4 flex items-center justify-between bg-canvas">
    <div className="flex items-center gap-4">
      <Typography variant="h5">
        Level 4 - Admin Panel
      </Typography>
      {nerdMode && <Badge>Nerd Mode</Badge>}
    </div>
    <div className="flex items-center gap-2">
      <Avatar alt={username} />
      <span>{username}</span>
    </div>
  </header>
)

/** Intro section with eyebrow/title/desc. */
export const IntroSection: React.FC<
  ComponentProps & {
    eyebrow?: string
    title?: string
    description?: string
  }
> = ({ eyebrow, title, description }) => (
  <section className="space-y-4">
    {eyebrow && (
      <Typography variant="overline">
        {eyebrow}
      </Typography>
    )}
    {title && (
      <Typography variant="h2">{title}</Typography>
    )}
    {description && (
      <Typography
        variant="body1"
        className="text-muted-foreground"
      >
        {description}
      </Typography>
    )}
  </section>
)

/** App header bar. */
export const AppHeader: React.FC<ComponentProps> = ({
  children,
}) => (
  <header className="border-b p-4 bg-canvas">
    {children}
  </header>
)

/** App footer bar. */
export const AppFooter: React.FC<ComponentProps> = ({
  children,
}) => (
  <footer className="border-t p-4 bg-canvas mt-auto">
    {children}
  </footer>
)

/** Sidebar navigation. */
export const Sidebar: React.FC<ComponentProps> = ({
  children,
  className = 'w-64 border-r p-4 bg-canvas',
}) => <aside className={className}>{children}</aside>
