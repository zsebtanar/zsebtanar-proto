export class HandlerError<TDetails = unknown> extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: TDetails,
    public readonly originalError?: Error,
  ) {
    super(message)
  }
}
