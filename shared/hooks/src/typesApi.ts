/**
 * REST API response and error types
 */

/** REST API response envelope */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

/** DBAL error codes */
export enum DBALErrorCode {
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  VALIDATION_ERROR = 422,
  RATE_LIMIT_EXCEEDED = 429,
  INTERNAL_ERROR = 500,
  TIMEOUT = 504,
  DATABASE_ERROR = 503,
  CAPABILITY_NOT_SUPPORTED = 501,
}

/** DBAL typed error */
export class DBALError extends Error {
  constructor(
    public code: DBALErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'DBALError'
  }

  /** Create from HTTP response status */
  static fromResponse(
    status: number,
    message: string,
    details?: Record<string, unknown>
  ): DBALError {
    const vals =
      Object.values(DBALErrorCode)
    const code = vals.includes(status)
      ? (status as DBALErrorCode)
      : DBALErrorCode.INTERNAL_ERROR
    return new DBALError(code, message, details)
  }

  /** Create a NOT_FOUND error */
  static notFound(
    message = 'Resource not found'
  ): DBALError {
    return new DBALError(
      DBALErrorCode.NOT_FOUND,
      message
    )
  }

  /** Create a VALIDATION_ERROR */
  static validationError(
    message: string,
    fields?: Array<{
      field: string
      error: string
    }>
  ): DBALError {
    return new DBALError(
      DBALErrorCode.VALIDATION_ERROR,
      message,
      { fields }
    )
  }
}
