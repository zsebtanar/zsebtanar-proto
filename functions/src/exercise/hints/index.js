import * as express from 'express'
import { admin } from '../../utils/fb-utils'
import nextHint from './nextHint'

export default express.Router().get('/', (req, res) => {
  const exerciseId = req.query.key
  const lastHint = req.query.hint

  admin
    .database()
    .ref(`/exercise/private/${exerciseId}`)
    .once('value')
    .then(nextHint(exerciseId, lastHint))
    .then(result => res.json(result))
    .catch(e => res.status(500).send(e.message))
})
