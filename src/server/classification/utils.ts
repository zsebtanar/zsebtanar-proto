import { fireStore } from '../utils/firebase'
import { firestore } from 'firebase-admin'

export function getClassificationLang(id: string): string {
  const lang = id.split('|').shift()
  if (!lang || lang.length > 2) {
    throw new Error('Invalid classification lang code')
  }
  return lang
}

export async function addExerciseToClassifications(
  batch: FirebaseFirestore.WriteBatch,
  exerciseId: string,
  classificationIds: string[],
): Promise<void> {
  await modifyClassification(
    batch,
    exerciseId,
    classificationIds,
    firestore.FieldValue.arrayUnion,
    firestore.FieldValue.increment(1),
  )
}

export async function removeExerciseFromClassifications(
  batch: FirebaseFirestore.WriteBatch,
  exerciseId: string,
  classificationIds: string[],
): Promise<void> {
  await modifyClassification(
    batch,
    exerciseId,
    classificationIds,
    firestore.FieldValue.arrayRemove,
    firestore.FieldValue.increment(-1),
  )
}

async function modifyClassification(
  batch: FirebaseFirestore.WriteBatch,
  exerciseId: string,
  classificationIds: string[],
  listOp: (classificationId: string) => firestore.FieldValue,
  countOp: firestore.FieldValue,
): Promise<void> {
  if (classificationIds.length < 1) {
    return
  }
  const lang = getClassificationLang(classificationIds[0])
  const summaryRef = fireStore.collection(`classification`).doc(lang)
  const detailsRef = fireStore.collection(`classification/${lang}/details`)
  const summaryData = (await summaryRef.get()).data() ?? {}

  const summaryUpdate = {}
  classificationIds.map(async (classificationId) => {
    batch.update(detailsRef.doc(classificationId), {
      exercises: listOp(exerciseId),
    })
    summaryUpdate[classificationId] = { ...summaryData[classificationId], exerciseCount: countOp }
  })
  batch.update(summaryRef, summaryUpdate)
}
