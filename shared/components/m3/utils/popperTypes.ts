import type React from 'react'

/** Placement options for the Popper. */
export type PopperPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/** Props passed to render-prop children. */
export interface PopperChildrenProps {
  placement: PopperPlacement
  TransitionProps?: { in: boolean }
}

/** Props for the Popper component. */
export interface PopperProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children'
  > {
  anchorEl?:
    | HTMLElement
    | (() => HTMLElement)
    | null
  children:
    | React.ReactNode
    | ((
        props: PopperChildrenProps
      ) => React.ReactNode)
  container?: HTMLElement | (() => HTMLElement)
  disablePortal?: boolean
  keepMounted?: boolean
  open?: boolean
  placement?: PopperPlacement
  popperRef?: React.Ref<HTMLDivElement>
  transition?: boolean
  testId?: string
}
