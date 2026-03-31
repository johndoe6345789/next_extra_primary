import React from 'react'

interface BoxProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  [key: string]: unknown
}

interface TypographyProps {
  children?: React.ReactNode
  variant?: string
  className?: string
  [key: string]: unknown
}

export function Box({
  children,
  className,
  style,
}: BoxProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

export function Typography({
  children,
  variant,
  className,
}: TypographyProps) {
  const tag = variant === 'h1' ? 'h1'
    : variant === 'h2' ? 'h2'
    : variant === 'caption' ? 'span'
    : 'p'
  return React.createElement(
    tag,
    { className },
    children,
  )
}
