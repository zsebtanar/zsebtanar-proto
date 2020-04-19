import * as Joi from 'joi'

export const addExerciseToRewardSchema = Joi.object().keys({
  exerciseId: Joi.required(),
  rewardId: Joi.required()
})