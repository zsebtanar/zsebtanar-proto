import * as Joi from 'joi'

export const addExerciseToRewardSchema = Joi.object().keys({
  exerciseId: Joi.required(),
  rewardId: Joi.required()
})

export const rewardSchema = Joi.object().keys({
  description: Joi.string().required(),
  name: Joi.string().required(),
  trophy: Joi.string().required()
})