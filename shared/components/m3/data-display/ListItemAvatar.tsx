'use client';
import React from 'react'
import styles
  from '../../../scss/atoms/mat-list.module.scss'
import type {
  ListItemAvatarProps,
  ListSubheaderProps,
} from './ListTypes'

export type {
  ListItemAvatarProps,
  ListSubheaderProps,
} from './ListTypes'

const s = (key: string): string =>
  styles[key] || key

/** ListItemAvatar - avatar slot in a list */
export const ListItemAvatar: React.FC<
  ListItemAvatarProps
> = ({ children, className = '',
  ...props }) => (
  <div className={
    `${s('mdc-list-item__start')} ${s('mat-mdc-list-item-avatar')} ${className}`.trim()
  } {...props}>
    {children}
  </div>
)

/** ListSubheader - section heading in list */
export const ListSubheader: React.FC<
  ListSubheaderProps
> = ({ children, className = '',
  ...props }) => (
  <li className={
    `${s('mdc-list-group__subheader')} ${className}`.trim()
  } {...props}>
    {children}
  </li>
)
