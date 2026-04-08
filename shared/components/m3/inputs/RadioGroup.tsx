import React, { forwardRef, createContext, useContext, Children, cloneElement, isValidElement, useId } from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/mat-radio.module.scss'
import { RadioGroupContextValue, RadioGroupProps } from './RadioGroupTypes'

export type { RadioGroupContextValue, RadioGroupProps } from './RadioGroupTypes'

const RadioGroupContext = createContext<RadioGroupContextValue>({})

/** Hook to access RadioGroup context */
export const useRadioGroup = () => useContext(RadioGroupContext)

/** RadioGroup - groups Radio buttons with shared state */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, name: nameProp, value, defaultValue, onChange, row = false, testId, className, ...props }, ref) => {
    const generatedName = useId()
    const name = nameProp ?? generatedName

    const groupClasses = classNames(styles.radioGroup, { [styles.radioGroupRow]: row }, className)

    const enhanced = Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      const cp = child.props as Record<string, unknown>
      const cv = cp.value as string | undefined
      return cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        name,
        checked: value !== undefined ? cv === value : undefined,
        defaultChecked: defaultValue !== undefined ? cv === defaultValue : undefined,
        onChange,
      })
    })

    return (
      <RadioGroupContext.Provider value={{ name, value, onChange }}>
        <div ref={ref} role="radiogroup" className={groupClasses} data-testid={testId} {...props}>
          {enhanced}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'
