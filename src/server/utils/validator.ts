import { Validator } from 'express-json-validator-middleware'

export const validate = new Validator({ allErrors: true }).validate
