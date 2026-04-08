import React from 'react'
import { Box } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'

export interface MailboxSearchBarProps {
  searchQuery: string
  onSearchChange?: (query: string) => void
  searchPlaceholder: string
}

/**
 * Search input bar for the mailbox header.
 */
export const MailboxSearchBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
}: MailboxSearchBarProps) => (
  <Box className="mailbox-header-search">
    <MaterialIcon
      name="search" size={20}
      className="mailbox-search-icon" />
    <input
      type="search"
      className="mailbox-search-input"
      placeholder={searchPlaceholder}
      value={searchQuery}
      onChange={(e) =>
        onSearchChange?.(e.target.value)}
      aria-label={searchPlaceholder} />
  </Box>
)
