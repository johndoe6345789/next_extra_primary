/**
 * Pagination - page navigation with configurable
 * boundary/sibling counts and custom rendering.
 */

import React from 'react'
import type { PaginationProps } from './PaginationTypes'
import { PaginationItem } from './PaginationItem'
import { generateItems } from './paginationUtils'

export type {
  PaginationProps,
  PaginationRenderItemParams,
  PaginationItemProps,
} from './PaginationTypes'
export { PaginationItem } from './PaginationItem'

/** Pagination navigation bar */
export const Pagination: React.FC<PaginationProps> = ({
  count = 1, page = 1, onChange,
  size = 'medium', color = 'standard',
  variant = 'text', shape = 'circular',
  boundaryCount = 1, siblingCount = 1,
  showFirstButton = false,
  showLastButton = false,
  hidePrevButton = false,
  hideNextButton = false,
  disabled = false, renderItem,
  className = '', sx, testId, ...props
}) => {
  const items = generateItems(
    page, count, boundaryCount, siblingCount,
    showFirstButton, showLastButton,
    hidePrevButton, hideNextButton, disabled,
  )

  const cls = [
    'pagination',
    `pagination--${size}`,
    `pagination--${color}`,
    `pagination--${variant}`,
    `pagination--${shape}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav
      className={cls}
      role="navigation"
      aria-label="Pagination"
      data-testid={testId}
      {...props}
    >
      {items.map((item, i) =>
        renderItem
          ? renderItem(item)
          : (
            <PaginationItem
              key={i}
              {...item}
              size={size}
              color={color}
              variant={variant}
              shape={shape}
              onClick={() =>
                item.page && onChange?.(item.page)
              }
            />
          ),
      )}
    </nav>
  )
}
