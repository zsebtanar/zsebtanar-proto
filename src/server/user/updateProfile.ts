import * as express from 'express'
import { admin } from '../utils/firebase'
import { onlyUser } from '../utils/authorization'
import { profileUpdateSchema } from './schemas'
import { verifyUser } from '../middlewares/firebaseToken'
import { HandlerError } from '../utils/HandlerError'
import { validate } from '../utils/validator'

export const route = express.Router()

route.post(
  '/profile/:uid',
  [verifyUser, onlyUser, validate({ body: profileUpdateSchema })],
  async (req, res, next) => {
    try {
      const uid = req.params.uid
      const data = req.body

      const user = await admin.auth().updateUser(uid, data)
      res.json(user)
    } catch (error) {
      next(new HandlerError(500, 'User update error', error))
    }
  },
)
