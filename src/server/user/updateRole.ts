import * as express from 'express'
import { admin } from '../utils/firebase'
import { onlyAdmin } from '../utils/authorization'
import { roleUpdateSchema } from './schemas'
import { getToken } from '../middlewares/firebaseToken'
import { HandlerError } from '../utils/HandlerError'
import { validate } from '../utils/validator'

export const route = express.Router()

route.post(
  '/role/:uid',
  [getToken, onlyAdmin, validate({ body: roleUpdateSchema })],
  async (req, res, next) => {
    try {
      const data = req.body
      const uid = req.params.uid

      const customClaims = {
        role: data.newRole,
      }

      await admin.auth().setCustomUserClaims(uid, customClaims)
      res.status(204).send()
    } catch (error) {
      next(new HandlerError(500, 'User role change error', error))
    }
  },
)
