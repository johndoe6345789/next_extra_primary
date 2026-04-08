import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/panel.module.scss'

export interface PanelTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
  /** Heading level for accessibility */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/** Heading component used inside a PanelHeader. */
export const PanelTitle: React.FC<
  PanelTitleProps
> = ({
  children,
  className,
  as: Component = 'h3',
  ...props
}) => (
  <Component
    className={classNames(
      styles.panelTitle,
      className
    )}
    {...props}
  >
    {children}
  </Component>
)

export interface PanelFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Show action buttons aligned right */
  actions?: boolean
}

/** Footer for a Panel component. */
export const PanelFooter: React.FC<
  PanelFooterProps
> = ({
  children,
  className,
  actions = false,
  ...props
}) => {
  const footerClass = classNames(
    actions
      ? styles.panelFooterActions
      : styles.panelFooter,
    className
  )

  return (
    <div className={footerClass} {...props}>
      {children}
    </div>
  )
}

export interface PanelSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Divider section inside a Panel. */
export const PanelSection: React.FC<
  PanelSectionProps
> = ({ children, className, ...props }) => (
  <div
    className={classNames(
      styles.panelSection,
      className
    )}
    {...props}
  >
    {children}
  </div>
)
