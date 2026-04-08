import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/title.module.scss'
import type { TitleProps, SubtitleProps }
  from './titleTypes'

export type {
  DisplaySize, HeadlineSize, TitleSize,
  TitleProps, SubtitleProps,
} from './titleTypes'

/** Title with display/headline/title variants */
export const Title: React.FC<TitleProps> = ({
  children, page, card, truncate, testId,
  className, as: Tag = 'h2',
  display, headline, title, ...props
}) => {
  const cls = classNames(
    { [styles.pageTitle]: page },
    { [styles.cardTitle]: card },
    { [styles.cardTitleTruncate]: truncate },
    { [styles.displayTitle]:
      display === 'large' },
    { [styles.displayTitleMedium]:
      display === 'medium' },
    { [styles.displayTitleSmall]:
      display === 'small' },
    { [styles.pageTitle]:
      headline === 'large' },
    { [styles.headline]:
      headline === 'medium' },
    { [styles.headlineSmall]:
      headline === 'small' },
    { [styles.cardTitle]:
      title === 'large' },
    { [styles.title]:
      title === 'medium' },
    { [styles.titleSmall]:
      title === 'small' },
    className)
  return (
    <Tag className={cls}
      data-testid={testId} {...props}>
      {children}
    </Tag>
  )
}

/** Subtitle for pages or cards. */
export const Subtitle: React.FC<
  SubtitleProps
> = ({
  children, className,
  page = true, card, ...props
}) => {
  const cls = classNames(
    { [styles.pageSubtitle]: page && !card },
    { [styles.cardSubtitle]: card },
    className)
  return (
    <p className={cls} {...props}>
      {children}
    </p>
  )
}
