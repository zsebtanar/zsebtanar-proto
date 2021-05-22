export class HandlerError<TDetails = unknown> extends Error {
  public statusCode: number
  public originalError?: Error
  public details?: TDetails

  constructor(statusCode: number, message: string, details?: TDetails, originalError?: Error) {
    super(message)
    this.statusCode = statusCode
    this.originalError = originalError
    this.details = details
  }
}
