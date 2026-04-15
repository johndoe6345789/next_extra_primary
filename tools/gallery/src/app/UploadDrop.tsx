'use client'

/**
 * Drag-and-drop bulk upload target for an album.
 * Delegates HTTP work to the useUpload hook.
 */

import { useState } from 'react'
import { Box, Typography } from '@shared/m3'
import { useUpload } from '@/hooks/useUpload'

/** Props for UploadDrop. */
export interface UploadDropProps {
  galleryId: number
  onUploaded: () => void
}

export function UploadDrop(
  { galleryId, onUploaded }: UploadDropProps,
) {
  const [active, setActive] = useState(false)
  const { upload, pending, error } =
    useUpload(galleryId)

  const onDrop = async (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault()
    setActive(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return
    await upload(files)
    onUploaded()
  }

  return (
    <Box
      className="upload-drop"
      data-testid="upload-drop"
      data-active={active}
      aria-label="Drop files to upload"
      onDragOver={e => {
        e.preventDefault()
        setActive(true)
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
    >
      <Typography>
        {pending
          ? 'Uploading…'
          : 'Drop images here to add to this album'}
      </Typography>
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
    </Box>
  )
}
