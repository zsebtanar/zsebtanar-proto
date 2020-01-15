import * as Joi from 'joi'
import { filter, identity, map, pipe, toPairs } from 'ramda'

/**
 * Validate request parameters with Joi
 *
 * You can validate any req param with similar schema parameter:
 *
 *    { query: Joi..., params: Joi...}
 *
 * @param schema  {object|Joi} Joi schema(s)
 * @param [options={}] {Object}  Joi options
 */
export default function requestValidator(schema, options?) {
  const schemas = schema.isJoi ? { body: schema } : schema
  return function validatorMiddleware(req, res, next) {
    const validate = ([key, schema]) => {
      const result = validator(options, req[key], schema) as Joi.ValidationResult<unknown>
      return result.error
        ? {
            message: `Schema validation failed: "${req.originalUrl} - req.${key}"`,
            details: result.error
          }
        : null
    }

    const errors = pipe(toPairs, map(validate), filter(identity as (any) => boolean))(schemas) as [
      string
    ]

    if (errors.length) {
      console.error(errors)
      res.status(400).send('Bad request')
    } else {
      next()
    }
  }
}

const validator = (options, data, schema) => Joi.validate(data, schema, options)
