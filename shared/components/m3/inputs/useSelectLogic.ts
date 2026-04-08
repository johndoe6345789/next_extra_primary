'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { SelectProps } from './SelectTypes'

/** Custom hook encapsulating Select state and logic */
export function useSelectLogic(props: SelectProps) {
  const { value: valueProp, defaultValue, multiple = false } = props

  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<unknown>(
    valueProp ?? defaultValue ?? (multiple ? [] : '')
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const value = valueProp !== undefined ? valueProp : internalValue

  useEffect(() => {
    if (valueProp !== undefined) setInternalValue(valueProp)
  }, [valueProp])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => {
      const panel = containerRef.current?.querySelector('[role="listbox"]')
      if (!panel) return
      const sel = panel.querySelector<HTMLElement>('[class*="highlighted"]')
      const first = panel.querySelector<HTMLElement>('button')
      ;(sel || first)?.focus()
    })
  }, [isOpen])

  return { isOpen, setIsOpen, internalValue, setInternalValue, containerRef, id, value }
}
