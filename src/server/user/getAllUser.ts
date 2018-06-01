import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'
import { evolve, map, pick } from 'ramda'

export default errorHandler((req, res) => {
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

  return admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then(evolve({ users: map(publicFields) }))
    .then(result => res.json(result))
})
