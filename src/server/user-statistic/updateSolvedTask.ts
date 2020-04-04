import { admin } from '../utils/firebase'
import { errorHandler } from '../utils/error'

export default errorHandler((req, res) => {
  const solvedTask = req.body;
  const uid = req.params.uid;
  const taskId = req.params.taskId;

  // TODO Check if anyone who is authenticated can call this with different uid
  return admin
    .database()
    .ref(`/userStatistics/${uid}/solvedTasks/${taskId}`)
    .set(solvedTask)
    .then(() => res.status(204).send());
})
