import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/section.module.scss'

export type SectionContentVariant =
  | 'elevated' | 'outlined' | 'transparent'

export interface SectionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  variant?: SectionContentVariant
}

/** Styled content area inside a Section. */
export const SectionContent: React.FC<
  SectionContentProps
> = ({
  children, variant, className, ...props
}) => (
  <div
    className={classNames(
      styles.sectionContent,
      {
        [styles.sectionContentElevated]:
          variant === 'elevated',
        [styles.sectionContentOutlined]:
          variant === 'outlined',
        [styles.sectionContentTransparent]:
          variant === 'transparent',
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
)
