'use client'

import { useCallback, useRef, useState } from 'react'

/** Custom hook for file upload logic */
export function useFileUpload(opts: {
  multiple: boolean; maxSize?: number; maxFiles?: number
  dragDrop: boolean; disabled?: boolean
  onChange?: (files: File[]) => void; onRemove?: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateFiles = useCallback((fileList: File[]): File[] => {
    let valid = fileList
    if (opts.maxSize) {
      valid = valid.filter((f) => {
        if (f.size > opts.maxSize!) {
          setErrorMessage(`File ${f.name} exceeds max size of ${opts.maxSize! / 1024 / 1024}MB`)
          return false
        }
        return true
      })
    }
    if (opts.maxFiles && valid.length > opts.maxFiles) {
      setErrorMessage(`Maximum ${opts.maxFiles} files allowed`)
      valid = valid.slice(0, opts.maxFiles)
    }
    return valid
  }, [opts.maxSize, opts.maxFiles])

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    setErrorMessage(null)
    const valid = validateFiles(Array.from(fileList))
    if (opts.multiple) {
      const combined = [...files, ...valid]
      const limited = opts.maxFiles ? combined.slice(0, opts.maxFiles) : combined
      setFiles(limited); opts.onChange?.(limited)
    } else {
      setFiles(valid.slice(0, 1)); opts.onChange?.(valid.slice(0, 1))
    }
  }, [files, opts, validateFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const handleRemove = useCallback((file: File) => {
    const next = files.filter((f) => f !== file)
    setFiles(next); opts.onChange?.(next); opts.onRemove?.(file)
  }, [files, opts])

  const handleClick = useCallback(() => { inputRef.current?.click() }, [])

  return { inputRef, files, isDragging, setIsDragging, errorMessage, handleFiles, handleChange, handleRemove, handleClick }
}
