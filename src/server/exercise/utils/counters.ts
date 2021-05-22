import { firestore } from 'firebase-admin'
import { fireStore } from '../../utils/firebase'

export async function incrementPrivateExerciseCounter(n: number): Promise<void> {
  const countInc = firestore.FieldValue.increment(n)
  const countRef = fireStore.collection('exercise').doc('private')

  // Update counter
  await countRef.update({ count: countInc })
}
