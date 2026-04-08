/**
 * Core API Middleware
 * Handles save and execution operations
 */

import type { Middleware } from '@reduxjs/toolkit'
import type {
  ApiMiddlewareConfig,
} from './apiMiddlewareTypes'
import { handleSave } from './apiSaveHandler'
import {
  handleExecution,
} from './apiExecutionHandler'

/**
 * Creates an API middleware for async
 * workflow operations. Handles saving,
 * execution, and error cases.
 *
 * @param config - Services and actions
 * @returns Redux middleware
 */
export const createApiMiddleware = (
  config: ApiMiddlewareConfig
): Middleware => {
  const {
    workflowService,
    executionService,
    actions,
  } = config

  return ((store: any) =>
    (next: any) =>
    (action: any) => {
      return (async () => {
        if (
          action.type ===
            'workflow/setSaving' &&
          action.payload === true
        ) {
          return handleSave(
            store,
            next,
            action,
            workflowService,
            actions
          )
        }

        if (
          action.type ===
          'workflow/startExecution'
        ) {
          return handleExecution(
            store,
            next,
            action,
            executionService,
            actions
          )
        }

        return next(action)
      })()
    }) as any
}

/**
 * Default no-op API middleware
 * @deprecated Use createApiMiddleware
 */
export const apiMiddleware: Middleware =
  () => (next) => (action) => next(action)
