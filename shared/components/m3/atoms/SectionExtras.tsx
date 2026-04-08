import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/section.module.scss'

export {
  SectionContent,
  type SectionContentProps,
  type SectionContentVariant,
} from './SectionContent'

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  size?: 'sm' | 'md'
}

/** Header for a Section component. */
export const SectionHeader: React.FC<
  SectionHeaderProps
> = ({
  children, size = 'md', className, ...props
}) => (
  <div
    className={classNames(
      styles.sectionHeader,
      {
        [styles.sectionHeaderSm]: size === 'sm',
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export interface SectionTitleProps
  extends React.HTMLAttributes<
    HTMLHeadingElement
  > {
  children?: React.ReactNode
}

/** Title heading inside a SectionHeader. */
export const SectionTitle: React.FC<
  SectionTitleProps
> = ({ children, className, ...props }) => (
  <h3
    className={classNames(
      styles.sectionTitle, className
    )}
    {...props}
  >
    {children}
  </h3>
)

export interface SectionSubtitleProps
  extends React.HTMLAttributes<
    HTMLParagraphElement
  > {
  children?: React.ReactNode
}

/** Subtitle text inside a SectionHeader. */
export const SectionSubtitle: React.FC<
  SectionSubtitleProps
> = ({ children, className, ...props }) => (
  <p
    className={classNames(
      styles.sectionSubtitle, className
    )}
    {...props}
  >
    {children}
  </p>
)
