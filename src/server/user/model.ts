import * as Joi from 'joi'

export const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(128)
    .required(),
  email: Joi.string()
    .email()
    .required()
})

export const roleUpdateSchema = Joi.object().keys({
  newRole: Joi.number()
    .min(0)
    .required()
})

export const profileUpdateSchema = Joi.object().keys({
  displayName: Joi.string()
    .min(3)
    .max(64)
    .required(),
  photoURL: Joi.string().uri()
})
