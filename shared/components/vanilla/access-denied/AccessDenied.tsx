'use client'

import { createElement } from 'react'
import type { AccessDeniedProps } from './types'
import { DEFAULT_LEVEL_NAMES } from './types'

/**
 * Access Denied display showing user vs required
 * permission level.
 *
 * @param props - Component props.
 */
export function AccessDenied({
  requiredLevel,
  userLevel,
  title = 'Access Denied',
  message = 'Your permission level is insufficient to access this page.',
  homeUrl = '/',
  levelNames = DEFAULT_LEVEL_NAMES,
  className,
  style,
}: AccessDeniedProps) {
  const reqName =
    levelNames[requiredLevel] ?? `Level ${requiredLevel}`
  const userName =
    levelNames[userLevel] ?? `Level ${userLevel}`

  return createElement('div', {
    className: `access-denied ${className ?? ''}`,
    style: {
      padding: '2rem', maxWidth: '600px',
      margin: '4rem auto', textAlign: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fafafa',
      ...style,
    },
  },
    createElement('h1', {
      style: {
        fontSize: '2rem', fontWeight: 'bold',
        marginBottom: '1rem', color: '#d32f2f',
      },
    }, title),
    createElement('p', {
      style: {
        fontSize: '1.125rem',
        marginBottom: '0.5rem', color: '#424242',
      },
    }, message),
    createElement('div', {
      style: {
        margin: '1.5rem 0', padding: '1rem',
        backgroundColor: '#fff', borderRadius: '4px',
        border: '1px solid #e0e0e0',
      },
    },
      createElement('p', {
        style: { marginBottom: '0.5rem', color: '#616161' },
      },
        createElement('strong', null, 'Your Level:'),
        ` ${userName} (${userLevel})`,
      ),
      createElement('p', {
        style: { color: '#616161' },
      },
        createElement('strong', null, 'Required Level:'),
        ` ${reqName} (${requiredLevel})`,
      ),
    ),
    createElement('a', {
      href: homeUrl,
      style: {
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1976d2',
        color: 'white', textDecoration: 'none',
        borderRadius: '4px', fontSize: '1rem',
        fontWeight: '500',
        transition: 'background-color 0.2s',
      },
    }, 'Return Home'),
  )
}
