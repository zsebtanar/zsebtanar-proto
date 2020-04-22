import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import { onlyAdmin } from '../utils/authorization'
import { addExerciseToRewardSchema, rewardSchema } from './schema'
import requestValidator from '../middlewares/requestValidator'
import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'

export const route = express.Router()
const DB = admin.database()
const REWARDS = DB.ref('rewards')

// Update or add
route.post('/addReward', [getToken, onlyAdmin, requestValidator({ body: rewardSchema })], errorHandler((req, res) => {
  let reward = req.body

  if (!reward._key) {
    const rewardKey = REWARDS.push().key
    reward._key = rewardKey
  }

  return REWARDS.child(reward._key).push(reward).then(() => res.status(204).send())
}))

route.post('/addExerciseToReward', [getToken, onlyAdmin, requestValidator({ body: addExerciseToRewardSchema })], errorHandler((req, res) => {
  const rewardId = req.body.rewardId
  const exerciseId = req.body.exerciseId

  return REWARDS.child(`${rewardId}`).once("value", snapshot => {
    if (snapshot.exists()) {
      REWARDS.child(`${rewardId}/additionalInfo/shouldComplete/`).push(exerciseId).then(() => res.status(204).send())
    } else {
      res.status(404).send(`Reward with id ${rewardId} not found.`)
    }
  })
}))
