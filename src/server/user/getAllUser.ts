import * as express from 'express'
import { admin } from '../utils/firebase'
import { evolve, map, pick } from 'ramda'
import { onlyAdmin } from '../utils/authorization'
import { ErrorHandler } from '../middlewares/error'
import { getToken } from '../middlewares/firebaseToken'

export const route = express.Router()

route.get('/all', [getToken, onlyAdmin], async (req, res, next) => {
  try {
    const nextPageToken = req.query.pageToken
    const publicFields = pick([
      'uid',
      'disabled',
      'email',
      'emailVerified',
      'metadata',
      'providerData',
      'displayName',
      'customClaims',
    ])

    const data = await admin.auth().listUsers(1000, nextPageToken)
    res.json(evolve({ users: map(publicFields) }, data))
  } catch (error) {
    next(new ErrorHandler(500, 'User list all error', error))
  }
})
