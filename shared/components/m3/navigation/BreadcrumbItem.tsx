import React from 'react'
import styles
  from '../../../scss/atoms/breadcrumbs.module.scss'
import type { BreadcrumbItem }
  from './Breadcrumbs'

/** Props for a single breadcrumb item. */
export interface BreadcrumbItemRendererProps {
  item: BreadcrumbItem
  index: number
  isLast: boolean
  separator: React.ReactNode
  renderLink?: (
    item: BreadcrumbItem,
    index: number,
  ) => React.ReactNode
  testId?: string
}

/** Renders a single breadcrumb list item. */
export const BreadcrumbItemRenderer: React.FC<
  BreadcrumbItemRendererProps
> = ({
  item, index, isLast, separator,
  renderLink, testId,
}) => (
  <li className={styles.breadcrumbsItem}
    role="listitem"
    aria-current={
      isLast ? 'page' : undefined
    }>
    {item.href && !isLast ? (
      <>
        {renderLink
          ? renderLink(item, index)
          : (
            <a href={item.href}
              data-testid={testId
                ? `${testId}-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`
                : undefined}>
              {item.label}
            </a>
          )}
        <span className={
          styles.breadcrumbsSeparator
        } aria-hidden="true">
          {separator}
        </span>
      </>
    ) : (
      <>
        <span className={
          styles.breadcrumbsCurrent
        } aria-current="page">
          {item.label}
        </span>
        {!isLast && (
          <span className={
            styles.breadcrumbsSeparator
          } aria-hidden="true">
            {separator}
          </span>
        )}
      </>
    )}
  </li>
)
