import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'

export default errorHandler((req, res) => {
  const data = req.body
  const uid = req.params.uid

  const customClaims = {
    role: data.newRole
  }

  // TODO Check if anyone who is authenticated can call this with different uid
  return admin
    .auth()
    .setCustomUserClaims(uid, customClaims)
    .then(() => res.status(204).send())
})
