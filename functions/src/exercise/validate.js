import * as express from 'express'
import { admin } from '../common/fb-utils'
import validator from './userControls/validator'

export default express.Router().post('/', (req, res) => {
  const exerciseId = req.body.key
  const userSolutions = req.body.solutions

  admin
    .database()
    .ref(`/exercise/private/${exerciseId}`)
    .once('value')
    .then(snapshot => {
      try {
        res.json({ valid: validator(userSolutions, snapshot.val()) })
      } catch (e) {
        res.status(500).send(e.message)
      }
    })
})
