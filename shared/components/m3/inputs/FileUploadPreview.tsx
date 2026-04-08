'use client'

import React from 'react'

/**
 * Props for FileUploadPreview
 */
interface FileUploadPreviewProps {
  files: File[]
  disabled?: boolean
  onRemove: (file: File) => void
}

/**
 * Preview list of uploaded files with remove buttons
 */
export function FileUploadPreview({
  files,
  disabled,
  onRemove,
}: FileUploadPreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="file-upload__preview">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="file-upload__file"
        >
          <span className="file-upload__filename">
            {file.name}
          </span>
          <span className="file-upload__size">
            {(file.size / 1024).toFixed(1)} KB
          </span>
          <button
            type="button"
            className="file-upload__remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(file)
            }}
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}
