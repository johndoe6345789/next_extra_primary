/**
 * Step, StepConnector, and StepIcon sub-components.
 * Re-exports StepLabel, StepButton, StepContent.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/Stepper.module.scss'
import type {
  StepProps,
  StepConnectorProps,
  StepIconProps,
} from './StepperTypes'

export {
  StepLabel,
  StepButton,
  StepContent,
} from './StepperLabel'

/** A single step container */
export const Step: React.FC<StepProps> = ({
  children, active, completed, disabled,
  expanded, index, last, className, ...props
}) => (
  <div
    className={classNames(styles.step, {
      [styles.active]: active,
      [styles.completed]: completed,
      [styles.clickable]: !disabled && props.onClick,
    }, className)}
    data-index={index}
    {...props}
  >
    {children}
  </div>
)

/** Connector line between steps */
export const StepConnector: React.FC<
  StepConnectorProps
> = ({
  orientation = 'horizontal', completed,
  className, ...props
}) => (
  <div
    className={classNames(styles.connector, {
      [styles.horizontal]:
        orientation === 'horizontal',
      [styles.vertical]:
        orientation === 'vertical',
      [styles.completed]: completed,
    }, className)}
    {...props}
  >
    <span className={styles.connectorLine} />
  </div>
)

/** Step icon with active/completed/error states */
export const StepIcon: React.FC<StepIconProps> = ({
  active, completed, error, icon,
  className, ...props
}) => (
  <div
    className={classNames(styles.stepIcon, {
      [styles.active]: active,
      [styles.completed]: completed,
      [styles.error]: error,
    }, className)}
    {...props}
  >
    {completed ? '\u2713' : error ? '!' : icon}
  </div>
)
