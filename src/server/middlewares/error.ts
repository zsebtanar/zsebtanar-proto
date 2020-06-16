export class ErrorHandler extends Error {
  public statusCode: number
  public originalError?: Error

  constructor(statusCode, message: string, originalError?: Error) {
    super(message)
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mainErrorHandler(err: ErrorHandler, req, res, next) {
  const { statusCode, message, originalError } = err
  console.error(message, originalError)
  if (__DEV__) {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      details: originalError?.stack
    })
  } else {
    res.status(statusCode).send(message)
  }
}
