import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'

export default errorHandler((req, res) => {
  const uid = req.params.uid
  const data = req.body

  return admin
    .auth()
    .updateUser(uid, data)
    .then(user => res.json(user))
})
