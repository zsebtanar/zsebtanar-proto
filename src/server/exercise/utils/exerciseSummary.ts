import { pickBy } from 'ramda'
import { ExerciseDoc, ExerciseSummaryDoc } from '../../../shared/exercise/types'
import { fireStore } from '../../utils/firebase'
import { interpretExerciseMarkdown } from '../../utils/search/pocketLisp'

export async function storeExerciseSummary(
  id: string,
  exercise: ExerciseDoc,
): Promise<FirebaseFirestore.WriteResult> {
  const summaryRef = fireStore.collection('exercise/summary/items').doc(id)
  const { title, difficulty, classifications, published, description, script } = exercise

  const compiledDescription = interpretExerciseMarkdown(script, description)

  const summary: ExerciseSummaryDoc = pickBy((val) => val !== undefined, {
    title,
    classifications,
    published,
    description: compiledDescription,
    difficulty,
  })
  return summaryRef.set(summary)
}
