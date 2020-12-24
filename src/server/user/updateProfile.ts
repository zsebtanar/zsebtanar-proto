import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'

export default errorHandler((req, res) => {
  const uid = req.params.uid
  const data = req.body

  // TODO Check if anyone who is authenticated can call this with different uid
  return admin
    .auth()
    .updateUser(uid, data)
    .then(user => res.json(user))
})
