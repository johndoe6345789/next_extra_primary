'use client';
import React from 'react'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/mat-list.module.scss'
import { ListProps } from './ListTypes'

export type { ListProps } from './ListTypes'

export { ListItem, ListItemButton }
  from './ListItems'
export type { ListItemProps, ListItemButtonProps }
  from './ListItems'

export {
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  ListSubheader,
} from './ListExtras'
export type {
  ListItemIconProps,
  ListItemTextProps,
  ListItemAvatarProps,
  ListSubheaderProps,
} from './ListExtras'

const s = (key: string): string =>
  styles[key] || key

/**
 * List - M3 styled list container
 */
export const List: React.FC<ListProps> = ({
  children,
  dense,
  spaced,
  component: Component = 'ul',
  disablePadding,
  testId,
  className = '',
  sx,
  style,
  ...props
}) => {
  const classNames = [
    s('matList'),
    s('mdc-list'),
    s('mat-mdc-list-base'),
    dense ? s('dense') : '',
    spaced ? s('spaced') : '',
    disablePadding ? s('noPadding') : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      className={classNames}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid={testId}
      role={
        Component !== 'ul' && Component !== 'ol'
          ? 'list'
          : undefined
      }
      {...props}
    >
      {children}
    </Component>
  )
}

export default List
