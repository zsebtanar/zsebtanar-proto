import z from 'zod'

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
      console.error(error)
      res.status(400).send('Bad request')
    }
  }
}
