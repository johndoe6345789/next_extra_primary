import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/mat-divider.module.scss'
import { sxToStyle } from '../utils/sx'
import { DividerProps } from './DividerTypes'
import { DividerWithText }
  from './DividerWithText'

export type {
  DividerVariant, DividerTextAlign,
  DividerProps,
} from './DividerTypes'

/** Horizontal or vertical separator. */
export const Divider: React.FC<
  DividerProps
> = ({
  vertical = false, variant,
  thick = false, light = false,
  dark = false, flexItem = false,
  section = false, children,
  textAlign = 'center',
  testId, sx, className, style, ...props
}) => {
  if (children) {
    return (
      <DividerWithText
        textAlign={textAlign}
        testId={testId}
        className={className}
        {...(props as React.HTMLAttributes<
          HTMLDivElement
        >)}>
        {children}
      </DividerWithText>
    )
  }
  return (
    <hr role="separator"
      data-testid={testId}
      style={{
        ...sxToStyle(sx), ...style,
      }}
      className={classNames(
        styles.divider, {
          [styles.dividerVertical]: vertical,
          [styles.dividerFullBleed]:
            variant === 'fullBleed',
          [styles.dividerInset]:
            variant === 'inset',
          [styles.dividerInsetStart]:
            variant === 'insetStart',
          [styles.dividerInsetEnd]:
            variant === 'insetEnd',
          [styles.dividerInsetBoth]:
            variant === 'insetBoth',
          [styles.dividerMiddle]:
            variant === 'middle',
          [styles.dividerThick]: thick,
          [styles.dividerLight]: light,
          [styles.dividerDark]: dark,
          [styles.dividerFlexItem]: flexItem,
          [styles.dividerSection]: section,
        }, className,
      )} {...props} />
  )
}

export default Divider
