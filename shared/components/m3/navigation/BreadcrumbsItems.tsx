/**
 * BreadcrumbsItemList - items-based rendering
 * for the Breadcrumbs component.
 */

import React from 'react'
import styles
  from '../../../scss/atoms/breadcrumbs.module.scss'
import { classNames } from '../utils/classNames'
import type { BreadcrumbItem }
  from './Breadcrumbs'
import { BreadcrumbItemRenderer }
  from './BreadcrumbItem'

/** Props for the items-based breadcrumb list */
export interface BreadcrumbsItemListProps {
  items: BreadcrumbItem[]
  separator: React.ReactNode
  renderLink?: (
    item: BreadcrumbItem,
    index: number,
  ) => React.ReactNode
  className?: string
  testId?: string
}

/** Renders an ordered breadcrumb list. */
export const BreadcrumbsItemList: React.FC<
  BreadcrumbsItemListProps
  & React.HTMLAttributes<HTMLElement>
> = ({
  items, separator, renderLink,
  className, testId, ...props
}) => (
  <nav className={classNames(
    styles.breadcrumbs, className)}
    aria-label="Breadcrumb navigation"
    data-testid={testId} {...props}>
    <ol className={styles.breadcrumbsList}
      role="list">
      {items.map((item, index) => (
        <BreadcrumbItemRenderer
          key={index}
          item={item}
          index={index}
          isLast={
            index === items.length - 1
          }
          separator={separator}
          renderLink={renderLink}
          testId={testId} />
      ))}
    </ol>
  </nav>
)
