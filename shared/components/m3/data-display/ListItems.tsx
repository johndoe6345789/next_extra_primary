'use client';
import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/mat-list.module.scss'
import { ListItemProps, ListItemButtonProps } from './ListTypes'

export type { ListItemProps, ListItemButtonProps } from './ListTypes'

const s = (key: string): string => styles[key] || key

/** ListItem - single list entry */
export const ListItem: React.FC<ListItemProps> = ({
  children, clickable, selected, disabled, borderless,
  disablePadding, disableGutters, className = '', sx, style, ...props
}) => {
  const cls = [
    s('mdc-list-item'), s('mat-mdc-list-item'), s('mdc-list-item--with-one-line'),
    clickable ? s('mat-mdc-list-item-interactive') : '',
    selected ? s('mdc-list-item--selected') : '', disabled ? s('mdc-list-item--disabled') : '',
    borderless ? s('borderless') : '', disablePadding ? s('noPadding') : '',
    disableGutters ? s('noGutters') : '', className,
  ].filter(Boolean).join(' ')

  return (
    <li className={cls} style={{ ...sxToStyle(sx), ...style }} {...props}>
      <span className={s('mat-focus-indicator')} />
      {children}
    </li>
  )
}

/** ListItemButton - interactive list item */
export const ListItemButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, ListItemButtonProps>(
  ({ children, selected, disabled, component, href, className = '', sx, style, ...props }, ref) => {
    const Comp = component || (href ? 'a' : 'button')
    const elProps = href ? { href, ...props } : props
    const cls = [
      s('mdc-list-item'), s('mat-mdc-list-item'), s('mat-mdc-list-item-interactive'),
      s('mdc-list-item--with-one-line'),
      selected ? `${s('mdc-list-item--selected')} ${s('mdc-list-item--activated')}` : '',
      disabled ? s('mdc-list-item--disabled') : '', className,
    ].filter(Boolean).join(' ')

    return (
      <Comp ref={ref} className={cls} style={{ ...sxToStyle(sx), ...style }} {...elProps}>
        <span className={s('mat-focus-indicator')} />
        {children}
      </Comp>
    )
  }
)

ListItemButton.displayName = 'ListItemButton'
