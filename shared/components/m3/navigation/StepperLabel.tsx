/**
 * StepLabel, StepButton, and StepContent
 * sub-components for the Stepper.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/Stepper.module.scss'
import type {
  StepLabelProps,
  StepButtonProps,
  StepContentProps,
} from './StepperTypes'

/** Label with optional icon and description */
export const StepLabel: React.FC<StepLabelProps> = ({
  children, icon, optional, error,
  StepIconComponent, StepIconProps: iconProps,
  className, ...props
}) => (
  <span
    className={classNames(styles.stepContent, {
      [styles.error]: error,
    }, className)}
    {...props}
  >
    {icon !== false && (
      <span className={styles.stepIcon}>
        {StepIconComponent
          ? <StepIconComponent {...(iconProps ?? {})} />
          : icon}
      </span>
    )}
    <span className={styles.stepLabels}>
      <span className={styles.stepLabel}>
        {children}
      </span>
      {optional && (
        <span className={styles.optional}>
          {optional}
        </span>
      )}
    </span>
  </span>
)

/** Interactive step button wrapping a StepLabel */
export const StepButton: React.FC<StepButtonProps> = ({
  children, icon, optional, onClick, disabled,
  className, ...props
}) => (
  <button
    className={classNames(styles.clickable, className)}
    onClick={onClick}
    disabled={disabled}
    type="button"
    {...props}
  >
    <StepLabel icon={icon} optional={optional}>
      {children}
    </StepLabel>
  </button>
)

/** Expandable content area for vertical steppers */
export const StepContent: React.FC<StepContentProps> = ({
  children, className, ...props
}) => (
  <div
    className={classNames(styles.stepContent, className)}
    {...props}
  >
    {children}
  </div>
)
