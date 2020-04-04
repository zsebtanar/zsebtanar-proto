import { admin } from 'server/utils/firebase'

export const userSolvedAnExercise = (snapshot, context) => {
  const userUId = context.params.userUId
  const exerciseId = context.params.exerciseId
  
  const possible_rewards = admin.database().ref(`/exercise/${exerciseId}/rewards`)
}