'use client';
import React from 'react'
import styles
  from '../../../scss/atoms/mat-list.module.scss'
import type {
  ListItemIconProps,
  ListItemTextProps,
} from './ListTypes'

export type {
  ListItemIconProps,
  ListItemTextProps,
  ListItemAvatarProps,
  ListSubheaderProps,
} from './ListTypes'

const s = (key: string): string =>
  styles[key] || key

/** ListItemIcon - icon slot in a list item */
export const ListItemIcon: React.FC<
  ListItemIconProps
> = ({ children, className = '',
  ...props }) => (
  <span className={
    `${s('mdc-list-item__start')} ${s('mat-mdc-list-item-icon')} ${className}`.trim()
  } {...props}>
    {children}
  </span>
)

/** ListItemText - text content in list item */
export const ListItemText: React.FC<
  ListItemTextProps
> = ({ primary, secondary,
  className = '', ...props }) => (
  <div className={
    `${s('mdc-list-item__content')} ${className}`.trim()
  } {...props}>
    {primary && (
      <span className={
        s('mdc-list-item__primary-text')
      }>
        {primary}
      </span>
    )}
    {secondary && (
      <span className={
        `${s('mdc-list-item__secondary-text')} ${s('mat-mdc-list-item-line')}`
      }>
        {secondary}
      </span>
    )}
  </div>
)

export {
  ListItemAvatar, ListSubheader,
} from './ListItemAvatar'
