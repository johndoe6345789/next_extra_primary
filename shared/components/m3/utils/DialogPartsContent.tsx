import React from 'react'
import styles
  from '../../../scss/atoms/mat-dialog.module.scss'

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  dividers?: boolean
}

/** Content area of a dialog. */
export const DialogContent: React.FC<
  DialogContentProps
> = ({
  children, dividers,
  className = '', ...props
}) => (
  <>
    {dividers && (
      <hr className={styles.dialogDivider} />
    )}
    <div
      className={
        `${styles.dialogContent} ${className}`
      }
      {...props}
    >
      {children}
    </div>
    {dividers && (
      <hr className={styles.dialogDivider} />
    )}
  </>
)

export interface DialogContentTextProps
  extends React.HTMLAttributes<
    HTMLParagraphElement
  > {
  children?: React.ReactNode
}

/** Paragraph text inside dialog content. */
export const DialogContentText: React.FC<
  DialogContentTextProps
> = ({ children, className = '', ...props }) => (
  <p
    className={
      `${styles.dialogContent} ${className}`
    }
    style={{ margin: 0 }}
    {...props}
  >
    {children}
  </p>
)
