import * as express from 'express'
import { admin } from '../utils/firebase'
import { onlyUser } from '../utils/authorization'
import { profileUpdateSchema } from './model'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'
import { requestValidator } from '../middlewares/requestValidator'

export const route = express.Router()

route.post(
  '/profile/:uid',
  [getToken, onlyUser, requestValidator({ body: profileUpdateSchema })],
  async (req, res, next) => {
    try {
      const uid = req.params.uid
      const data = req.body

      const user = await admin.auth().updateUser(uid, data)
      res.json(user)
    } catch (error) {
      next(new ErrorHandler(500, 'User update error', error))
    }
  },
)
