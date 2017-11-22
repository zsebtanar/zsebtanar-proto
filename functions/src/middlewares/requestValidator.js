import * as Joi from 'joi'
import { filter, identity, map, toPairs, pipe } from 'ramda'

/**
 * Validate request parameters with Joi 
 * 
 * You can validate any req param with similar schema parameter:
 * 
 *    { query: Joi..., params: Joi...}
 * 
 * @param schema  {object|Joi} Joi schema(s) 
 * @param [options={}] {Object}  Joi options
 * @returns {validatorMiddleware}
 */
export default function requestValidator(schema, options) {
  const schemas = schema.isJoi ? { body: schema } : schema
  return function validatorMiddleware(req, res, next) {
    const validate = ([key, schema]) => {
      const result = validator(options, req[key], schema)
      return result.error
        ? {
            message: `Schema validation failed: "${res.originalPath} - req.${key}"`,
            details: result.error
          }
        : null
    }

    const errors = pipe(toPairs, map(validate), filter(identity))(schemas)

    if (errors.length) {
      console.error(errors)
      res.status(400).send('Bad request')
    } else {
      next()
    }
  }
}

const validator = (options, data, schema) => Joi.validate(data, schema, options)
