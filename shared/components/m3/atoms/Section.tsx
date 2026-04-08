import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/section.module.scss'

export type SectionSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  size?: SectionSize
  /** @deprecated Use size="sm" instead */
  sm?: boolean
  /** Test ID for automated testing */
  testId?: string
}

/** Section container with size variants. */
export const Section: React.FC<SectionProps> = ({
  children,
  size = 'md',
  sm,
  testId,
  className,
  ...props
}) => {
  const effectiveSize = sm ? 'sm' : size

  return (
    <div
      className={classNames(
        styles.section,
        {
          [styles.sectionSm]:
            effectiveSize === 'sm',
          [styles.sectionLg]:
            effectiveSize === 'lg',
          [styles.sectionXl]:
            effectiveSize === 'xl',
        },
        className
      )}
      data-testid={testId}
      role="region"
      {...props}
    >
      {children}
    </div>
  )
}

// Re-export sub-components
export {
  SectionHeader,
  type SectionHeaderProps,
  SectionTitle,
  type SectionTitleProps,
  SectionSubtitle,
  type SectionSubtitleProps,
  SectionContent,
  type SectionContentVariant,
  type SectionContentProps,
} from './SectionExtras'
export {
  SectionActions,
  type SectionActionsProps,
  SectionDivider,
  type SectionDividerProps,
} from './SectionActions'
