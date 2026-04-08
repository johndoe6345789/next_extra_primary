'use client'

import React from 'react'

/** @internal Dots animation size props. */
interface DotsAnimationProps {
  size: 'small' | 'medium' | 'large'
}

/** Animated dots indicator. */
export function DotsAnimation({
  size,
}: DotsAnimationProps) {
  const dotMap = {
    small: '6px',
    medium: '10px',
    large: '14px',
  }
  const d = dotMap[size]
  return (
    <div style={{
      display: 'flex', gap: '6px',
      alignItems: 'center',
    }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: d, height: d,
          borderRadius: '50%',
          backgroundColor: '#228be6',
          animation:
            'dots-animation 1.4s infinite',
          animationDelay: `${i * 0.16}s`,
        }} />
      ))}
    </div>
  )
}
