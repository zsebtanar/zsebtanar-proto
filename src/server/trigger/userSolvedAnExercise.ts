import { admin } from '../utils/firebase'

export const userSolvedAnExercise = (snapshot, context) => {
  const userUId = context.params.userUId
  const exerciseId = context.params.exerciseId
  const db = admin.database()

  console.info(`Exercise Id: ${exerciseId}`)
  db.ref(`/exercise/public/${exerciseId}/rewards`)
    .once('value')
    .then(rewardsSnapshot => {
      const possibleRewards = rewardsSnapshot.val();
      console.info(possibleRewards)

      if (Array.isArray(possibleRewards)) {
        console.info(`User UId: ${userUId}`)
        db.ref(`/userStatistics/${userUId}/solvedExercises`)
        .once('value')
        .then(solvedSnapshot => {
          const solvedExercises = solvedSnapshot.val()

          console.info(solvedExercises)

          possibleRewards.forEach(rewardId => {
            db.ref(`reward/${rewardId}/additionalInfo/shouldComplete`)
          });
        })
      }
    })
}