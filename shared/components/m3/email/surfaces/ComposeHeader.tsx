'use client';

import React from 'react'
import { Box } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'

export interface ComposeHeaderProps {
  onClose?: () => void
}

/**
 * Header bar of the compose window with
 * title and close button.
 */
export const ComposeHeader = ({
  onClose,
}: ComposeHeaderProps) => (
  <Box className="compose-header">
    <h2 id="compose-dialog-title">
      Compose Email
    </h2>
    <button onClick={onClose}
      className="close-btn"
      aria-label="Close"
      data-testid="compose-close-btn">
      <MaterialIcon name="close" />
    </button>
  </Box>
)
