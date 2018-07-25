import * as express from 'express'
import { admin } from '../../utils/firebase'
import validator from './validator'

export const route = express.Router()

route.post('/', (req, res) => {
  const exerciseId = req.body.key
  const taskId = req.body.task
  const userSolutions = req.body.solutions as ObjectMap<DB.UserControlSolution>

  admin
    .database()
    .ref(`/exercise/private/${exerciseId}/subTasks/${taskId}`)
    .once('value')
    .then(snapshot => validator(userSolutions, snapshot.val()))
    .then(result => res.json({ valid: result }))
    .catch(e => res.status(500).send(e.message))
})
