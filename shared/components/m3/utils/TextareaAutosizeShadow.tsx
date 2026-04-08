'use client'

import React from 'react'

/** Props for the shadow textarea. */
export interface TextareaAutosizeShadowProps {
  shadowRef: React.RefObject<
    HTMLTextAreaElement | null
  >
}

/**
 * Hidden shadow textarea used to measure
 * the auto-sized height.
 */
export function TextareaAutosizeShadow({
  shadowRef,
}: TextareaAutosizeShadowProps) {
  return (
    <textarea
      ref={shadowRef}
      className="m3-textarea-autosize-shadow"
      tabIndex={-1}
      aria-hidden="true"
      readOnly
      style={{
        position: 'absolute',
        visibility: 'hidden',
        overflow: 'hidden',
        height: 0,
        top: 0,
        left: 0,
        transform: 'translateZ(0)',
      }}
    />
  )
}
