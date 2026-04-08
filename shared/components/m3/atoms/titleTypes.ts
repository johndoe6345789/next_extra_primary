import type React from 'react'

/** Display size for hero sections. */
export type DisplaySize =
  | 'large' | 'medium' | 'small'

/** Headline size variants. */
export type HeadlineSize =
  | 'large' | 'medium' | 'small'

/** Title size variants. */
export type TitleSize =
  | 'large' | 'medium' | 'small'

/** Props for the Title component. */
export interface TitleProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  /** @deprecated Use variant props instead */
  page?: boolean
  /** @deprecated Use variant props instead */
  card?: boolean
  truncate?: boolean
  as?: React.ElementType
  /** Display variant (large, medium, small) */
  display?: DisplaySize
  /** Headline variant */
  headline?: HeadlineSize
  /** Title variant */
  title?: TitleSize
  /** Test ID for automated testing */
  testId?: string
}

/** Props for the Subtitle component. */
export interface SubtitleProps
  extends React.HTMLAttributes<
    HTMLParagraphElement
  > {
  children?: React.ReactNode
  /** @deprecated Use variant prop instead */
  page?: boolean
  /** Use card variant for card subtitles */
  card?: boolean
}
