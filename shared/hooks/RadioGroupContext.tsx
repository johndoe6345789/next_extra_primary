import React, {
  createContext,
  useContext,
  useId,
  Children,
  cloneElement,
  isValidElement,
} from 'react'
import type { RadioGroupProps } from './RadioGroup'

/**
 * RadioGroup context value
 */
interface RadioGroupContextValue {
  name?: string
  value?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const RadioGroupContext =
  createContext<RadioGroupContextValue>({})

/**
 * Hook to access RadioGroup context
 */
export const useRadioGroup = () =>
  useContext(RadioGroupContext)

/**
 * Enhance children with group context
 * @param children - Radio button elements
 * @param name - Group name
 * @param value - Selected value
 * @param defaultValue - Default value
 * @param onChange - Change handler
 */
export function buildRadioChildren(
  children: React.ReactNode,
  name: string,
  value?: string,
  defaultValue?: string,
  onChange?: RadioGroupProps['onChange']
) {
  return Children.map(children, (child) => {
    if (isValidElement(child)) {
      const cv = (
        child.props as Record<string, unknown>
      ).value as string | undefined
      return cloneElement(
        child as React.ReactElement<
          Record<string, unknown>
        >,
        {
          name,
          checked: value !== undefined
            ? cv === value
            : undefined,
          defaultChecked:
            defaultValue !== undefined
              ? cv === defaultValue
              : undefined,
          onChange,
        }
      )
    }
    return child
  })
}

export { RadioGroupContext }
