import { fireStore } from '../../utils/firebase'
import { ClassificationSummaryDoc } from '../../../shared/classification/type'
import { ExerciseDoc } from '../../../shared/exercise/types'

export async function getClassifications(exercise: ExerciseDoc): Promise<ClassificationSummaryDoc> {
  const clsSummaryRef = fireStore.collection('classification').doc(exercise.lang)
  return (await clsSummaryRef.get()).data() as ClassificationSummaryDoc
}
