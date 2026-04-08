import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/panel.module.scss'

export type PanelBodyVariant =
  | 'default'
  | 'noPadding'
  | 'scroll'

export interface PanelBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Body padding/scroll variant */
  variant?: PanelBodyVariant
}

/** Panel body with padding variants. */
export const PanelBody: React.FC<
  PanelBodyProps
> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const bodyClass = classNames(
    {
      [styles.panelBody]: variant === 'default',
      [styles.panelBodyNoPadding]:
        variant === 'noPadding',
      [styles.panelBodyScroll]:
        variant === 'scroll',
    },
    className
  )

  return (
    <div className={bodyClass} {...props}>
      {children}
    </div>
  )
}
