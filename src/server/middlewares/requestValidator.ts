import * as z from 'zod'
import { ErrorHandler } from './error'

interface SchemaParam {
  query?: z.ZodType<unknown>
  params?: z.ZodType<unknown>
  body?: z.ZodType<unknown>
}

/**
 * Validate request parameters with Zod
 *
 * You can validate any req param with similar schema parameter:
 *
 *    { query: ZodSchema..., params: ZodSchema..., body: ZodSchema}
 *
 * @param schemas  {object} Zos schema(s)
 */
export function requestValidator(schemas: SchemaParam) {
  return function validatorMiddleware(req, res, next) {
    try {
      Object.entries(schemas).forEach(([key, schema]) => schema.parse(req[key]))
      next()
    } catch (error) {
      next(new ErrorHandler(400, 'Bad request', error))
    }
  }
}
