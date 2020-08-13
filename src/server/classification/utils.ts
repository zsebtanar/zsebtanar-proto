import { fireStore } from '../utils/firebase'
import { firestore } from 'firebase-admin'

export async function addExerciseToClassifications(
  batch: FirebaseFirestore.WriteBatch,
  exerciseId: string,
  classificationIds: string[],
): Promise<void> {
  classificationIds.map(async (classificationId) => {
    const classificationRef = fireStore.collection('classification').doc(classificationId)
    batch.update(classificationRef, {
      exercises: firestore.FieldValue.arrayUnion(exerciseId),
    })
  })
}

export async function removeExerciseFromClassifications(
  batch: FirebaseFirestore.WriteBatch,
  exerciseId: string,
  classificationIds: string[],
): Promise<void> {
  classificationIds.map(async (classificationId) => {
    const classificationRef = fireStore.collection('classification').doc(classificationId)
    batch.update(classificationRef, {
      exercises: firestore.FieldValue.arrayRemove(exerciseId),
    })
  })
}
