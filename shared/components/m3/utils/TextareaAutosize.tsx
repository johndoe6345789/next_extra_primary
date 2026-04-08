'use client'

import React, {
  forwardRef, useRef, useCallback,
} from 'react'
import { classNames } from './classNames'
import { useTextareaAutosize }
  from './useTextareaAutosize'
import { TextareaAutosizeShadow }
  from './TextareaAutosizeShadow'

export interface TextareaAutosizeProps
  extends Omit<
    React.TextareaHTMLAttributes<
      HTMLTextAreaElement
    >, 'rows'
  > {
  minRows?: number
  maxRows?: number
  testId?: string
}

/**
 * TextareaAutosize - Textarea that auto-adjusts
 * height based on content.
 */
export const TextareaAutosize = forwardRef<
  HTMLTextAreaElement, TextareaAutosizeProps
>(function TextareaAutosize(
  {
    minRows = 1, maxRows,
    onChange, value, defaultValue,
    className, style, testId, ...props
  }, ref
) {
  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null)
  const combinedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node
      if (ref) {
        if (typeof ref === 'function') ref(node)
        else ref.current = node
      }
    }, [ref]
  )
  const { shadowRef, syncHeight } =
    useTextareaAutosize(
      minRows, maxRows, value, textareaRef)
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    syncHeight()
    onChange?.(e)
  }
  return (
    <>
      <textarea ref={combinedRef}
        className={classNames(
          'm3-textarea-autosize', className)}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
        data-testid={testId}
        style={{
          resize: 'none',
          overflow: 'hidden',
          ...style,
        }}
        rows={minRows}
        {...props} />
      <TextareaAutosizeShadow
        shadowRef={shadowRef} />
    </>
  )
})

export default TextareaAutosize
