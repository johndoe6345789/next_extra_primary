import React from 'react'
import styles
  from '../../../scss/atoms/mat-dialog.module.scss'

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  withIcon?: boolean
}

/** Header area of a dialog. */
export const DialogHeader: React.FC<
  DialogHeaderProps
> = ({
  children, withIcon,
  className = '', ...props
}) => (
  <div
    className={`${styles.dialogHeader} ${withIcon ? styles.dialogHeaderWithIcon : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
)

export interface DialogTitleProps
  extends React.HTMLAttributes<
    HTMLHeadingElement
  > {
  children?: React.ReactNode
}

/** Title heading inside a dialog. */
export const DialogTitle: React.FC<
  DialogTitleProps
> = ({ children, className = '', ...props }) => (
  <h2
    className={
      `${styles.dialogTitle} ${className}`
    }
    {...props}
  >
    {children}
  </h2>
)
