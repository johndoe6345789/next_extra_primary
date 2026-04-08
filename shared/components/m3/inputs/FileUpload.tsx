'use client'

import React, { forwardRef, useCallback } from 'react'
import { FormLabel } from './FormLabel'
import { FormHelperText } from './FormHelperText'
import { FileUploadProps } from './FileUploadTypes'
import { FileUploadPreview } from './FileUploadPreview'
import { useFileUpload } from './useFileUpload'

export type { FileUploadProps } from './FileUploadTypes'

/** FileUpload - drag-and-drop file upload component */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>((props, ref) => {
  const {
    testId, label, helperText, error, onChange, onRemove, disabled,
    required, className = '', accept, multiple = false, maxSize,
    maxFiles, dragDrop = true, showPreview = true, variant = 'default',
  } = props

  const st = useFileUpload({ multiple, maxSize, maxFiles, dragDrop, disabled, onChange, onRemove })

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); if (!disabled && dragDrop) st.setIsDragging(true)
  }, [disabled, dragDrop, st])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); st.setIsDragging(false)
    if (!disabled && dragDrop) st.handleFiles(e.dataTransfer.files)
  }, [disabled, dragDrop, st])

  const displayErr = st.errorMessage || (error ? helperText : null)

  return (
    <div
      className={`file-upload file-upload--${variant} ${error || st.errorMessage ? 'file-upload--error' : ''} ${disabled ? 'file-upload--disabled' : ''} ${className}`}
      data-testid={testId} aria-label={typeof label === 'string' ? label : undefined}
    >
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div
        className={`file-upload__dropzone ${st.isDragging ? 'file-upload__dropzone--dragging' : ''}`}
        onDragOver={onDragOver} onDragLeave={() => st.setIsDragging(false)} onDrop={onDrop} onClick={st.handleClick}
      >
        <input
          ref={(el) => {
            if (typeof ref === 'function') ref(el); else if (ref) ref.current = el
            ;(st.inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el
          }}
          type="file" onChange={st.handleChange} disabled={disabled}
          accept={accept} multiple={multiple} className="file-upload__input"
        />
        <div className="file-upload__content">
          <span className="file-upload__icon">&#128193;</span>
          <span className="file-upload__text">
            {st.isDragging ? 'Drop files here' : dragDrop ? 'Drag and drop or click to upload' : 'Click to upload'}
          </span>
          {accept && <span className="file-upload__hint">Accepted: {accept}</span>}
        </div>
      </div>
      {showPreview && <FileUploadPreview files={st.files} disabled={disabled} onRemove={st.handleRemove} />}
      {displayErr && <FormHelperText error>{displayErr}</FormHelperText>}
      {!displayErr && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  )
})

FileUpload.displayName = 'FileUpload'
