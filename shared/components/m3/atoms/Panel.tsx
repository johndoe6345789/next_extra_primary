import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/panel.module.scss'
import type { PanelProps } from './panelTypes'

export type {
  PanelVariant, PanelFixedPosition, PanelProps,
} from './panelTypes'

/** Panel container with M3 styling. */
export const Panel: React.FC<PanelProps> = ({
  children, className,
  variant = 'default', fixedPosition,
  collapsible = false, collapsed = false,
  testId, ...props
}) => {
  const panelClass = classNames(
    {
      [styles.panel]:
        variant === 'default' && !fixedPosition,
      [styles.panelElevated]:
        variant === 'elevated',
      [styles.panelOutlined]:
        variant === 'outlined',
    },
    {
      [styles.panelFixedBr]:
        fixedPosition === 'br',
      [styles.panelFixedBl]:
        fixedPosition === 'bl',
      [styles.panelFixedTr]:
        fixedPosition === 'tr',
      [styles.panelFixedTl]:
        fixedPosition === 'tl',
    },
    {
      [styles.panelCollapsible]: collapsible,
      [styles.panelCollapsed]:
        collapsible && collapsed,
    },
    className
  )
  return (
    <div className={panelClass}
      data-testid={testId} role="region"
      {...props}>
      {children}
    </div>
  )
}

export {
  PanelHeader, type PanelHeaderVariant,
  type PanelHeaderProps,
} from './PanelHeader'
export {
  PanelBody, type PanelBodyVariant,
  type PanelBodyProps,
} from './PanelBody'
export {
  PanelTitle, type PanelTitleProps,
  PanelFooter, type PanelFooterProps,
  PanelSection, type PanelSectionProps,
} from './PanelExtras'
