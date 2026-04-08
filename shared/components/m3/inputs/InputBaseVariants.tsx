'use client';
import React, { forwardRef } from 'react'
import { classNames } from '../utils/classNames'
import { InputBase } from './InputBase'
import {
  FilledInputProps,
  OutlinedInputProps,
} from './InputBaseTypes'

export type { FilledInputProps, OutlinedInputProps }
  from './InputBaseTypes'

/**
 * FilledInput - InputBase with filled variant style
 */
export const FilledInput = forwardRef<
  HTMLDivElement,
  FilledInputProps
>(function FilledInput(props, ref) {
  return (
    <InputBase
      ref={ref}
      {...props}
      className={classNames(
        'm3-filled-input',
        props.className
      )}
    />
  )
})

/**
 * OutlinedInput - InputBase with outlined variant
 */
export const OutlinedInput = forwardRef<
  HTMLDivElement,
  OutlinedInputProps
>(function OutlinedInput(
  { label, notched, ...props },
  ref
) {
  return (
    <InputBase
      ref={ref}
      {...props}
      className={classNames(
        'm3-outlined-input',
        props.className,
        {
          'm3-outlined-input-notched': notched,
        }
      )}
    />
  )
})
