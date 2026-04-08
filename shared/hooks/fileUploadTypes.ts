/**
 * Type definitions for useFileUpload hook
 */

/** Return type of useFileUpload */
export interface UseFileUploadReturn {
  /** Whether files are being dragged over */
  isDragging: boolean
  /** Currently selected files */
  selectedFiles: File[]
  /** Handle files from input or drop */
  handleFiles: (
    files: FileList | null
  ) => void
  /** Handle drop event */
  handleDrop: (e: React.DragEvent) => void
  /** Handle drag over event */
  handleDragOver: (e: React.DragEvent) => void
  /** Handle drag leave event */
  handleDragLeave: () => void
  /** Remove a file by index */
  removeFile: (index: number) => void
}
