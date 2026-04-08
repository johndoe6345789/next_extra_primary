/**
 * Stepper - progress indicator with numbered steps.
 * Re-exports all sub-components for convenience.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/Stepper.module.scss'
import type { StepperProps } from './StepperTypes'
import { StepConnector } from './StepperParts'

export type {
  StepperProps,
  StepProps,
  StepLabelProps,
  StepButtonProps,
  StepContentProps,
  StepConnectorProps,
  StepIconProps,
} from './StepperTypes'

export {
  Step,
  StepLabel,
  StepButton,
  StepContent,
  StepConnector,
  StepIcon,
} from './StepperParts'

/**
 * Container that lays out Step children with
 * connectors between them.
 */
export const Stepper: React.FC<StepperProps> = ({
  children,
  activeStep,
  orientation = 'horizontal',
  alternativeLabel = false,
  nonLinear = false,
  connector,
  className,
  testId,
  ...props
}) => (
  <div
    role="navigation"
    aria-label="progress"
    data-testid={testId}
    className={classNames(
      styles.stepper,
      {
        [styles.horizontal]:
          orientation === 'horizontal',
        [styles.vertical]:
          orientation === 'vertical',
        [styles.alternativeLabel]: alternativeLabel,
      },
      className,
    )}
    {...props}
  >
    {React.Children.map(children, (child, index) => (
      <>
        {child}
        {index <
          React.Children.count(children) - 1 &&
          (connector || (
            <StepConnector orientation={orientation} />
          ))}
      </>
    ))}
  </div>
)
