export class ErrorHandler<TDetails = unknown> extends Error {
  public statusCode: number
  public originalError?: Error
  public details?: TDetails

  constructor(statusCode, message: string, details?: TDetails, originalError?: Error) {
    super(message)
    this.statusCode = statusCode
    this.originalError = originalError
    this.details = details
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mainErrorHandler(err: ErrorHandler, req, res, next) {
  const { statusCode, message, originalError, details } = err
  console.error(message, details, originalError)
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    details,
    stacktrace: __DEV__ ? originalError?.stack : undefined
  })
}
