import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'

export default errorHandler((req, res) => {
  const solvedTask = req.body;
  const uid = (req.params && req.params.uid)
  const exerciseId = (req.params && req.params.exerciseId)

  if(!uid || !exerciseId){
    throw new Error("uid and exerciseId can't be undefined/null or empty." )
  }

  // TODO Check if anyone who is authenticated can call this with different uid
  return admin
    .database()
    .ref(`/userStatistics/${uid}/solvedExercises/${exerciseId}`)
    .set(solvedTask)
    .then(() => res.status(204).send());
})
