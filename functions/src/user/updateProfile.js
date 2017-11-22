import { admin } from '../utils/fb-utils'
import { errorHandler } from '../utils/errors'
import { updateUserProfile } from './model'

export default errorHandler((req, res) => {
  const uid = req.params.uid
  const data = req.body

  return admin
    .auth()
    .updateUser(uid, data)
    .then(user => res.json(user))
})
