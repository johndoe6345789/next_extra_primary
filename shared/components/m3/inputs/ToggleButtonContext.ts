import { createContext, useContext } from 'react'
import { ToggleButtonGroupContextValue } from './ToggleButtonTypes'

/**
 * Context for toggle button group state sharing
 */
export const ToggleButtonGroupContext =
  createContext<ToggleButtonGroupContextValue | null>(
    null
  )

/**
 * Hook to access toggle button group context
 */
export const useToggleButtonGroup = () =>
  useContext(ToggleButtonGroupContext)
