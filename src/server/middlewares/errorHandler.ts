import type { NextFunction, Request, Response } from 'express'
import { HandlerError } from '../utils/HandlerError'
import { ValidationError } from 'express-json-validator-middleware'
import { logger } from 'firebase-functions'

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof ValidationError) {
    response.status(400).json({
      errors: error.validationErrors,
    })
  }

  if (error instanceof HandlerError) {
    const { statusCode, message, details, originalError } = error
    logger.error(message, request.path, details, originalError || error)
    response.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      details,
      stacktrace: __DEV__ ? originalError?.stack : undefined,
    })
  }

  next()
}
