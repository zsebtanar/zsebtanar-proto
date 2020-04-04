import * as Joi from 'joi'

export const solvedTaskUpdateSchema = Joi.object().keys({
  usedHelps: Joi.number().integer().required(),
  numberOfAttempts: Joi.number().integer().required(),
  time: Joi.number().integer().required()
})