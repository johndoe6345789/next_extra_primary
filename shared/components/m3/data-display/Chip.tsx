import React from 'react'
import { sxToStyle } from '../utils/sx'
import styles
  from '../../../scss/atoms/mat-chip.module.scss'
import { ChipProps } from './ChipTypes'
import { buildChipClasses }
  from './chipClassBuilder'

export type { ChipProps } from './ChipTypes'

/** Chip - compact element for tags/filters */
export const Chip: React.FC<ChipProps> = ({
  children, label, icon, onDelete,
  clickable, size, sm, color,
  success, error, warning, info,
  variant, outline, disabled,
  testId, className = '', sx, style,
  ...props
}) => {
  const cls = buildChipClasses({
    clickable, variant, outline, color,
    success, error, warning, info,
    size, sm, onDelete: !!onDelete,
    disabled, className,
  })
  const content = label ?? children
  return (
    <span
      className={cls.join(' ')}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid={testId}
      role={clickable || onDelete
        ? 'button' : undefined}
      {...props}
    >
      {icon && (
        <span className={
          `${styles.chipIcon} ${styles.chipIconLeading}`
        }>
          {icon}
        </span>
      )}
      {content}
      {onDelete && (
        <button
          className={styles.chipDelete}
          onClick={onDelete}
          type="button"
          aria-label="Remove"
        >
          &times;
        </button>
      )}
    </span>
  )
}

export default Chip
