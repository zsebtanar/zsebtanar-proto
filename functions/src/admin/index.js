import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import { onlyAdmin } from '../utils/authorization'
import { getAllPrivateExercise, savePublicExercise } from '../exercise/model'
import { EXERCISE_ACTIVE } from '../exercise/state'

export const route = express.Router()

// Update
route.get('/re-publish-all-exercise', [getToken, onlyAdmin], (req, res) => {
  getAllPrivateExercise()
    .then(snapshot => {
      const promises = []
      snapshot.forEach(function(childSnapshot) {
        const key = childSnapshot.key
        const data = childSnapshot.val()
        const isActive = data._state === EXERCISE_ACTIVE

        promises.push(isActive && savePublicExercise(key, data))
      })
      return Promise.all(promises)
    })
    .then(() => res.status(204).send())
    .catch(error => {
      console.error(error)
      res.status(500).send('Unexpected error')
    })
})
