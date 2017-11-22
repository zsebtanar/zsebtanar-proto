import { admin } from '../utils/fb-utils'
import { errorHandler } from '../utils/errors'
import { updateUser } from './model'

export default errorHandler((req, res) => {
  const data = req.body
  const uid = req.params.uid

  const customClaims = {
    role: data.newRole
  }

  return admin
    .auth()
    .setCustomUserClaims(uid, customClaims)
    .then(() => res.status(204).send())
})
