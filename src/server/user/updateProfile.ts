import * as express from 'express'
import { getToken, requestValidator } from '../middlewares'
import { admin } from '../utils/firebase'
import { onlyUser } from '../utils/authorization'
import { profileUpdateSchema } from './model'

export const route = express.Router()

route.post(
  '/profile/:uid',
  [getToken, onlyUser, requestValidator({ body: profileUpdateSchema })],
  async (req, res) => {
    try {
      const uid = req.params.uid
      const data = req.body

      const user = await admin.auth().updateUser(uid, data)
      res.json(user)
    } catch (error) {
      console.error(error)
      res.status(500).send('Unexpected error')
    }
  }
)
