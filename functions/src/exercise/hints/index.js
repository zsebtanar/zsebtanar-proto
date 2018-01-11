import * as express from 'express'
import { admin } from '../../utils/fb-utils'
import nextHint from './nextHint'

export const route = express.Router()

route.get('/', (req, res) => {
  const exerciseId = req.query.key
  const taskId = req.query.task
  const lastHint = req.query.hint

  admin
    .database()
    .ref(`/exercise/private/${exerciseId}/subTasks/${taskId}`)
    .once('value')
    .then(nextHint(lastHint))
    .then(result => res.json(result))
    .catch(e => res.status(500).send(e.message))
})
