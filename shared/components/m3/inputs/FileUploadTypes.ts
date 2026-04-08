import React from 'react'

/**
 * Props for the FileUpload component
 */
export interface FileUploadProps {
  testId?: string
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
  value?: File | File[]
  onChange?: (files: File[]) => void
  onRemove?: (file: File) => void
  disabled?: boolean
  required?: boolean
  className?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  dragDrop?: boolean
  showPreview?: boolean
  variant?: 'default' | 'button' | 'dropzone'
}
