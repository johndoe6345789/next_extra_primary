/**
 * useFileUpload Hook
 * File upload state with drag and drop
 */

import { useState } from 'react'
import type {
  UseFileUploadReturn,
} from './fileUploadTypes'

export type {
  UseFileUploadReturn,
} from './fileUploadTypes'

/**
 * Hook for managing file uploads
 * @param onFilesSelected - Files callback
 * @param maxSize - Max file size in bytes
 * @param disabled - Whether disabled
 */
export function useFileUpload(
  onFilesSelected: (files: File[]) => void,
  maxSize?: number,
  disabled?: boolean
): UseFileUploadReturn {
  const [isDragging, setIsDragging] =
    useState(false)
  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([])

  const handleFiles = (
    files: FileList | null
  ) => {
    if (!files) return
    const valid = Array.from(files).filter(
      (f) => !(maxSize && f.size > maxSize)
    )
    setSelectedFiles(valid)
    onFilesSelected(valid)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (
    e: React.DragEvent
  ) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    const next = selectedFiles.filter(
      (_, i) => i !== index
    )
    setSelectedFiles(next)
    onFilesSelected(next)
  }

  return {
    isDragging,
    selectedFiles,
    handleFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFile,
  }
}
