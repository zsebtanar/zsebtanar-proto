import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import { onlyAdmin } from '../utils/authorization'
import { addExerciseToRewardSchema } from './schema'
import requestValidator from 'server/middlewares/requestValidator'
import { admin } from 'server/utils/firebase'

export const route = express.Router()
const DB = admin.database()
const REWARDS = DB.ref('rewards')
const EXERCISES = DB.ref('exercise')

// Update or add
route.post('/addReward', [getToken, onlyAdmin], (req, res) => {

})

route.post('/addExerciseToReward', [getToken, onlyAdmin, requestValidator({ body: addExerciseToRewardSchema })], (req, res) => {
  const rewardId = req.body.rewardId
  const exerciseId = req.body.exerciseId
  Promise.all([
    REWARDS.child(`${rewardId}/additionalInfo/shouldComplete/`).push(exerciseId),
  ])
  .then(() => res.status(204).send())
})
