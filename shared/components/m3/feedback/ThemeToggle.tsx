'use client'

/**
 * Shared dark/light theme toggle.
 *
 * Toggles the `data-theme` attribute on
 * <html> and persists the choice to
 * localStorage so it survives reloads and
 * works in any tool that imports the M3
 * SCSS tokens.
 */

import React, {
  useEffect, useState, useCallback,
} from 'react'
import { Sun } from '../../../icons/react/m3/Sun'
import { Moon } from '../../../icons/react/m3/Moon'
import { IconButton } from '../inputs/IconButton'

const STORAGE_KEY = 'nextra:theme'

type Theme = 'light' | 'dark'

/** Read current theme; defaults to system pref. */
function readInitial(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved =
    window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') {
    return saved
  }
  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
  return prefersDark ? 'dark' : 'light'
}

/** Props for ThemeToggle. */
export interface ThemeToggleProps {
  testId?: string
  size?: number
}

/** Bell-sibling icon button that flips theme. */
export const ThemeToggle: React.FC<
  ThemeToggleProps
> = ({
  testId = 'theme-toggle',
  size = 24,
}) => {
  const [theme, setTheme] =
    useState<Theme>('light')

  // Read on mount; apply to <html>.
  useEffect(() => {
    const t = readInitial()
    setTheme(t)
    document.documentElement.setAttribute(
      'data-theme', t,
    )
  }, [])

  const flip = useCallback(() => {
    setTheme(prev => {
      const next: Theme =
        prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute(
        'data-theme', next,
      )
      window.localStorage.setItem(
        STORAGE_KEY, next,
      )
      return next
    })
  }, [])

  const label =
    theme === 'dark'
      ? 'Switch to light mode'
      : 'Switch to dark mode'

  return (
    <IconButton
      aria-label={label}
      onClick={flip}
      testId={testId}
    >
      {theme === 'dark'
        ? <Sun size={size} />
        : <Moon size={size} />}
    </IconButton>
  )
}

export default ThemeToggle
