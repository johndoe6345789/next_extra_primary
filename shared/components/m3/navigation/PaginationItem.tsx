/**
 * PaginationItem - a single page/nav button
 * or ellipsis span inside Pagination.
 */

import React from 'react'
import type { PaginationItemProps }
  from './PaginationTypes'
import {
  getPageContent, getPageAriaLabel,
} from './paginationHelpers'

/** Individual pagination button or ellipsis */
export const PaginationItem: React.FC<
  PaginationItemProps
> = ({
  type = 'page', page,
  selected = false, disabled = false,
  size = 'medium', color = 'standard',
  variant = 'text', shape = 'circular',
  onClick, className = '', ...props
}) => {
  if (type === 'ellipsis') {
    return (
      <span className={
        `pagination-item pagination-item--ellipsis ${className}`
      } {...(props as React.HTMLAttributes<
        HTMLSpanElement
      >)}>
        {getPageContent(type, page)}
      </span>
    )
  }
  const cls = [
    'pagination-item',
    `pagination-item--${type}`,
    `pagination-item--${size}`,
    `pagination-item--${variant}`,
    `pagination-item--${shape}`,
    selected
      ? 'pagination-item--selected' : '',
    disabled
      ? 'pagination-item--disabled' : '',
    className,
  ].filter(Boolean).join(' ')
  return (
    <button className={cls}
      disabled={disabled}
      onClick={onClick}
      aria-current={
        selected ? 'page' : undefined
      }
      aria-label={
        getPageAriaLabel(type, page)
      }
      {...(props as React.ButtonHTMLAttributes<
        HTMLButtonElement
      >)}>
      {getPageContent(type, page)}
    </button>
  )
}
