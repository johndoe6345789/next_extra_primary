import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/section.module.scss'

export interface SectionActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Action button row inside a Section. */
export const SectionActions: React.FC<
  SectionActionsProps
> = ({ children, className, ...props }) => (
  <div
    className={classNames(
      styles.sectionActions,
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export interface SectionDividerProps
  extends React.HTMLAttributes<HTMLHRElement> {}

/** Horizontal divider inside a Section. */
export const SectionDivider: React.FC<
  SectionDividerProps
> = ({ className, ...props }) => (
  <hr
    className={classNames(
      styles.sectionDivider,
      className
    )}
    {...props}
  />
)
