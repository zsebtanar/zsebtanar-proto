import { admin } from '../utils/firebase'

export const userSolvedAnExercise = (snapshot, context) => {
  const userUId = context.params.userUId
  const exerciseId = context.params.exerciseId
  const db = admin.database()

  console.info(`Exercise Id: ${exerciseId}`)
  return db.ref(`/exercise/public/${exerciseId}/rewards`)
    .once('value')
    .then(rewardsSnapshot => {
      const possibleRewards = rewardsSnapshot.val()
      console.info(possibleRewards)

      if (Array.isArray(possibleRewards)) {
        console.info(`User UId: ${userUId}`)
        db.ref(`/userStatistics/${userUId}/solvedExercises`)
          .once('value')
          .then(solvedSnapshot => {
            const solvedExerciseIds = Object.keys(solvedSnapshot.val())

            console.info(solvedExerciseIds)

            possibleRewards.forEach(rewardId => {
              const userRewardPath = `/users/${userUId}/rewards/${rewardId}`
              db.ref(userRewardPath).once('value').then(snapshot => {
                if (!snapshot.exists()) {
                  db.ref(`/rewards/${rewardId}/additionalInfo/shouldComplete`)
                    .once('value')
                    .then(shouldCompleteSnapshot => {
                      const shouldCompleteExerciseIds = shouldCompleteSnapshot.val()
                      console.log(shouldCompleteExerciseIds)
                      // shouldCompleteExerciseIds contains all solvedExerciseIds
                      if (shouldCompleteExerciseIds.every(v => solvedExerciseIds.includes(v))) {
                        db.ref(userRewardPath).set({
                          timeOfCollection: new Date().getTime() // Unix time
                        })
                      }
                    })
                }
              })
            })
          })
      }
    })
}