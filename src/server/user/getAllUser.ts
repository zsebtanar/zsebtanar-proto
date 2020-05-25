import * as express from 'express'
import { admin } from '../utils/firebase'
import { evolve, map, pick } from 'ramda'
import { getToken } from '../middlewares'
import { onlyAdmin } from '../utils/authorization'

export const route = express.Router()

route.get('/all', [getToken, onlyAdmin], async (req, res) => {
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
      'customClaims'
    ])

    const data = await admin.auth().listUsers(1000, nextPageToken)
    res.json(evolve({ users: map(publicFields) }, data))
  } catch (error) {
    console.error(error)
    res.status(500).send('Unexpected error')
  }
})
