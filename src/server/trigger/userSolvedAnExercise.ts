import { admin } from '../utils/firebase'

export const userSolvedAnExercise = (_, context) => {
  const userUId = context.params.userUId
  const exerciseId = context.params.exerciseId
  const db = admin.database()

  console.info(`Exercise Id: ${exerciseId}`)
  return db.ref(`/rewards`)
    .once('value')
    .then(rewardsSnapshot => {
      const possibleRewards = Object.values(rewardsSnapshot.val())
        .filter((r:any) => r && r.additionalInfo && r.additionalInfo.shouldComplete
          && r.additionalInfo.shouldComplete.includes(exerciseId))

      if (Array.isArray(possibleRewards)) {
        console.info(`User UId: ${userUId}`)
        db.ref(`/userStatistics/${userUId}/solvedExercises`)
          .once('value')
          .then(solvedSnapshot => {
            const solvedExerciseIds = Object.keys(solvedSnapshot.val())

            possibleRewards.forEach(reward => {
              const userRewardPath = `/users/${userUId}/rewards/${reward._key}`
              db.ref(userRewardPath).once('value').then(snapshot => {
                if (!snapshot.exists()) {
                  const shouldCompleteExerciseIds = reward.additionalInfo.shouldComplete

                  // shouldCompleteExerciseIds contains all solvedExerciseIds
                  if (shouldCompleteExerciseIds.every(v => solvedExerciseIds.includes(v))) {
                    db.ref(userRewardPath).set({
                      timeOfCollection: new Date().getTime() // Unix time
                    })
                  }
                }
              })
            })
          })
      }
    })
}