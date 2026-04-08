/**
 * Breadcrumbs - navigation hierarchy indicator.
 *
 * Supports two APIs:
 * 1. Children: pass elements directly.
 * 2. Items: pass an array of BreadcrumbItem objects.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/breadcrumbs.module.scss'
import { BreadcrumbsItemList } from './BreadcrumbsItems'

/** A single breadcrumb entry */
export interface BreadcrumbItem {
  label: string
  href?: string
}

/** Props for the Breadcrumbs component */
export interface BreadcrumbsProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  items?: BreadcrumbItem[]
  separator?: React.ReactNode
  renderLink?: (
    item: BreadcrumbItem,
    index: number,
  ) => React.ReactNode
  'data-testid'?: string
}

/** Breadcrumb navigation trail. */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  children,
  items,
  separator = '/',
  renderLink,
  className = '',
  'data-testid': testId,
  ...props
}) => {
  const valid = items?.filter(
    (i) => i.label && i.label.trim() !== '',
  ) ?? []

  if (valid.length > 0) {
    return (
      <BreadcrumbsItemList
        items={valid}
        separator={separator}
        renderLink={renderLink}
        className={className}
        testId={testId}
        {...props}
      />
    )
  }

  const validChildren = React.Children.toArray(
    children,
  ).filter(
    (c) => c != null && typeof c !== 'boolean',
  )

  return (
    <nav
      className={classNames(styles.breadcrumbs, className)}
      aria-label="breadcrumb"
      data-testid={testId}
      {...props}
    >
      <ol className={styles.breadcrumbsList}>
        {validChildren.map((child, i) => (
          <li key={i} className={styles.breadcrumbsItem}>
            {i > 0 && (
              <span className={styles.breadcrumbsSeparator}>
                {separator}
              </span>
            )}
            {child}
          </li>
        ))}
      </ol>
    </nav>
  )
}
