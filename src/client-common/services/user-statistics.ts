import { cloudFnPost } from 'client-common/util/firebase'

export const updateSolvedExercise = (uid, exerciseId, data) =>
  cloudFnPost(`userStatistic/updateSolvedExercise/${uid}/${exerciseId}`, data, { withToken: true })