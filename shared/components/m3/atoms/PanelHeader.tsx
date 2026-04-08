import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/panel.module.scss'

export type PanelHeaderVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'surface'

export interface PanelHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Header color variant */
  variant?: PanelHeaderVariant
  /** Make header clickable (collapsible panels) */
  clickable?: boolean
}

/** Panel header with color variants. */
export const PanelHeader: React.FC<
  PanelHeaderProps
> = ({
  children,
  className,
  variant = 'primary',
  clickable = false,
  ...props
}) => {
  const headerClass = classNames(
    {
      [styles.panelHeader]:
        variant === 'primary',
      [styles.panelHeaderSecondary]:
        variant === 'secondary',
      [styles.panelHeaderTertiary]:
        variant === 'tertiary',
      [styles.panelHeaderSurface]:
        variant === 'surface',
      [styles.panelHeaderClickable]: clickable,
    },
    className
  )

  return (
    <div className={headerClass} {...props}>
      {children}
    </div>
  )
}
