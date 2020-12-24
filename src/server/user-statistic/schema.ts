import * as Joi from 'joi'

export const solvedExerciseUpdateSchema = Joi.object().keys({
  usedHelps: Joi.number().integer().required(),
  numberOfAttempts: Joi.number().integer().required(),
  startTime: Joi.number().integer().required(),
  endTime: Joi.number().integer().required()
})